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

        // Send success email
        emailext(
            subject: "Build #${env.BUILD_NUMBER} succeeded - ${env.JOB_NAME}",
            body: """
                <p>Hi Team,</p>
                <p>The Jenkins build <b>#${env.BUILD_NUMBER}</b> for <b>${env.JOB_NAME}</b> was successful!</p>
                <p><b>Details:</b></p>
                <ul>
                  <li>Job: ${env.JOB_NAME}</li>
                  <li>Build Number: ${env.BUILD_NUMBER}</li>
                  <li>URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></li>
                </ul>
                <p>Regards,<br>Jenkins CI</p>
            """,
            mimeType: 'text/html',
            to: 'Ajitesh.Kumar@iiitb.ac.in'
        )
    }

    failure {
        echo "Build ${env.BUILD_NUMBER} failed"

        // Send failure email
        emailext(
            subject: "❌ Build #${env.BUILD_NUMBER} failed - ${env.JOB_NAME}",
            body: """
                <p>Hi Team,</p>
                <p>The Jenkins build <b>#${env.BUILD_NUMBER}</b> for <b>${env.JOB_NAME}</b> has failed.</p>
                <p><b>Check logs:</b> <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
                <p>Regards,<br>Jenkins CI</p>
            """,
            mimeType: 'text/html',
            to: 'your_email@example.com'
        )
    }

    always {
        cleanWs()  
    }
  }

}
