pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  environment {
    NODE_ENV = "test"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        // Add ESLint if you’ve set it up; otherwise comment this out
        sh 'npm run lint || true'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
      post {
        always {
          // Archive coverage folder if available
          archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
        }
      }
    }
  }

  post {
    success {
      echo "✅ Build ${env.BUILD_NUMBER} passed!"
    }
    failure {
      echo "❌ Build ${env.BUILD_NUMBER} failed."
    }
    always {
      cleanWs()
    }
  }
}
