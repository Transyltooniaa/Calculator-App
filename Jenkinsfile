pipeline {
  agent any

  environment {
    NODE_ENV = 'test'
    CI = 'true'
    DOCKER_USER = 'tranyltoonia'
    DOCKER_IMAGE_NAME = 'calculator-app'
    DOCKER_TAG = "latest"
    DOCKER_IMAGE = "${DOCKER_USER}/${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"
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
        sh 'npm test'
      }
      post {
        always {
          archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
        }
      }
    }
  }

  stage('Build Image') {
    steps {
      script {
        docker.build("${DOCKER_IMAGE}", ".")
      }
    }
  }

  stage('Push Image') {
    steps {
      script {
        docker.withRegistry('https://index.docker.io/v1/', 'docker_creds') {
          docker.image("${DOCKER_IMAGE}").push()
        }
      }
    }
  }

  post {
    success {
      echo "✅ Build ${env.BUILD_NUMBER} passed"
    }
    failure {
      echo "❌ Build ${env.BUILD_NUMBER} failed"
    }
    always {
      cleanWs()   
    }
  }
}
