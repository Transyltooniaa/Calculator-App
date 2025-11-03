pipeline {

// agent is used to specify where the pipeline or a specific stage will run
  agent any

  environment {
    // standard environment variable in Node.js used to control behavior based on environment type — like development, test, or production.
    // Since we are using npm run test:cov, setting NODE_ENV to 'test' ensures that any test-specific configurations or behaviors are activated during the testing phase.(Node_env=test disables caching, may use mock databases or in-memory stores.)
    // If it weren’t set, NODE_ENV would default to undefined, which can lead to inconsistent results between local testing and CI runs.
    NODE_ENV = 'test'

    // Jenkins environment variable to indicate CI environment
    CI = 'true'

    // Docker Hub username
    DOCKER_USER = 'transyltoonia'

    // Docker image name
    DOCKER_IMAGE_NAME = 'calculator-app'

    // Docker image tag
    DOCKER_TAG = "latest"

    // Docker image is in the format: user/image_name:tag
    DOCKER_IMAGE = "${DOCKER_USER}/${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"

    // Path for Docker binary on macOS
    PATH = "/Applications/Docker.app/Contents/Resources/bin:/usr/local/bin:/opt/homebrew/bin:${env.PATH}"
  }

  tools {
    // Node.js version configured in Jenkins global tools. Necessary for npm commands in the jenkins pipeline.
    nodejs 'node'
  }

  options {
    // Add timestamps to the console output for better logging
    timestamps()

      // Set a timeout for the entire pipeline to prevent hanging builds
    timeout(time: 10, unit: 'MINUTES')  

    // Prevent concurrent builds of the same job to avoid conflicts (e.g., pushing to Docker Hub simultaneously)
    disableConcurrentBuilds()            
  }


  stages {
    stage('Checkout') {
      steps {
        // Checkout the code from the repository using the provided SCM configuration
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
        emailext(
            subject: "❌ Build #${env.BUILD_NUMBER} failed - ${env.JOB_NAME}",
            body: """
                <p>Hi Team,</p>
                <p>The Jenkins build <b>#${env.BUILD_NUMBER}</b> for <b>${env.JOB_NAME}</b> has failed.</p>
                <p><b>Check logs:</b> <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
                <p>Regards,<br>Jenkins CI</p>
            """,
            mimeType: 'text/html',
            to: 'Ajitesh.Kumar@iiitb.ac.in'
        )
    }

    always {
        cleanWs()  
    }
  }

}
