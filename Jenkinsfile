pipeline {
  agent any

  tools {
    nodejs 'node'   // <- must match the Tool name you added
  }

  options { timestamps() }

  environment { NODE_ENV = 'test' }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Diagnostics') {
      steps {
        sh 'echo PATH=$PATH'
        sh 'which node || true'
        sh 'node -v && npm -v'
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

    stage('Test') { steps { sh 'npm test' } }
  }

  post {
    always { cleanWs() }
  }
}
