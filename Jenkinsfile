pipeline {
  agent {
    docker {
      image 'node:6-alpine'
      //args '-p 8080:8080'
    }
  }
  stages {
    stage('Build') {
      steps {
        sh 'echo "Building! new"'
        sh 'npm install --prefix src' 
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying!'
        //sh 'npm start --prefix src'
      }
    }
  }
  post {
    always {
      echo 'Post action fired'

    }

  }
}