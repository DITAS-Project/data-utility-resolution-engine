pipeline {
  agent {
    docker {
      image 'node:6-alpine'
      args '-p 8080:8080'
    }
  }
  stages {
    stage('Build') {
      steps {
        sh 'echo "Building! new"'
        sh 'npm install'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying!'
      }
    }
  }
  post {
    always {
      echo 'Post action fired'

    }

  }
}