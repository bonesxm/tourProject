pipeline {
  agent any

  environment {
    DOCKER_BUILDKIT = '1'
    COMPOSE_DOCKER_CLI_BUILD = '1'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Frontend Dependencies') {
      steps {
        dir('client') {
          sh 'npm ci'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('client') {
          sh 'npm run build'
        }
      }
    }

    stage('Install Backend Dependencies') {
      steps {
        dir('server') {
          sh 'npm ci'
        }
      }
    }

    stage('Smoke Test Backend') {
      steps {
        dir('server') {
          sh 'node -e "console.log(`backend deps ok`)"'
        }
      }
    }

    stage('Docker Compose Build') {
      steps {
        sh 'docker compose build'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker compose up -d'
      }
    }
  }
}

