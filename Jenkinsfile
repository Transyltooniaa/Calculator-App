pipeline {
  agent any

  tools {
    nodejs 'node'
  }

  options {
    timestamps()
    timeout(time: 10, unit: 'MINUTES')   // prevent hangs
    disableConcurrentBuilds()            // no overlapping builds on same branch
  }

  environment {
    NODE_ENV = 'test'
    CI = 'true'
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
          // Archive coverage reports if Jest generates them
          archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
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
      cleanWs()   // clean workspace after every run
    }
  }
}
