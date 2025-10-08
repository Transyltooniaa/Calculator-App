pipeline {
  agent any

  environment {
    NODE_ENV = 'test'
    CI = 'true'
    DOCKER_USER = 'transyltoonia'
    DOCKER_IMAGE_NAME = 'calculator-app'
    DOCKER_TAG = "latest"
    DOCKER_IMAGE = "${DOCKER_USER}/${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"
    PATH = "/Applications/Docker.app/Contents/Resources/bin:/usr/local/bin:/opt/homebrew/bin:${env.PATH}"
  }

  tools {
    nodejs 'node'
  }

  options {
    timestamps()
    timeout(time: 10, unit: 'MINUTES')  
    disableConcurrentBuilds()            
  }


  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh '''
          if [ -f package-lock.json ]; then
            npm ci
          else
            npm install
          fi
        '''
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test:cov'
      }
      post {
        always {
          archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
        }
      }
    }

    stage('Docker Diagnostics') {
      steps {
        sh '''
          echo "USER=$(id -un)"
          echo "PATH=$PATH"
          which docker || true
          docker version || echo "docker version failed"
        '''
      }
    }

    stage('Build Image') {
      steps {
        script {
          sh '''
            /usr/local/bin/docker build -t ${DOCKER_IMAGE} .
          '''
        }
      }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker_creds', usernameVariable: 'USR', passwordVariable: 'PSW')]) {
          sh '''
            echo "$PSW" | /usr/local/bin/docker login -u "$USR" --password-stdin
            /usr/local/bin/docker push ${DOCKER_IMAGE}
            /usr/local/bin/docker logout
          '''
        }
      }
    }

    stage('Use ansible to deploy'){
      steps{
        sh 'ansible-playbook -i ansible/inventory.ini ansible/deploy.yml'
      }
    }
  }
  
  post {
    success {
      echo "Build ${env.BUILD_NUMBER} passed"

      // Publish HTML coverage report if it exists
      script {
        if (fileExists('coverage/lcov-report/index.html')) {
          publishHTML(target: [
            reportDir: 'coverage/lcov-report',
            reportFiles: 'index.html',
            reportName: 'Jest Coverage Report'
          ])
        } else {
          echo "No coverage report found to publish."
        }
      }
    }

    failure {
      echo "Build ${env.BUILD_NUMBER} failed"
    }

    always {
      cleanWs()  
    }
  }

}
