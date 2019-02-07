pipeline {
	agent none
	stages {
		stage('Build - test') {
			agent {
				docker {
                    image 'node:9-alpine'
					// TODO some cache to avoid npm sintall on every execution?
				}
			}
			steps {
				sh 'echo "Building! new"'
				//sh 'npm install --prefix src' 
				sh 'cd src; npm install'
			}
		}
		stage('Staging image creation') {
			agent any
			steps {
				// The Dockerfile.artifact copies the code into the image and run the jar generation.
				echo 'Creating the image...'
				
				// This will search for a Dockerfile.artifact in the working directory and build the image to the local repository
				sh "docker build -t \"ditas/data-utility-resolution-engine:staging\" -f Dockerfile.artifact ."
				echo "Done"
				echo 'Retrieving Docker Hub password from /opt/ditas-docker-hub.passwd...'
				
				// Get the password from a file. This reads the file from the host, not the container. Slaves already have the password in there.
				script {
					password = readFile '/opt/ditas-docker-hub.passwd'
				}
				echo "Done"
				echo 'Login to Docker Hub as ditasgeneric...'
				sh "docker login -u ditasgeneric -p ${password}"
				echo "Done"
				echo "Pushing the image ditas/data-utility-resolution-engine:staging..."
				sh "docker push ditas/data-utility-resolution-engine:staging"
				echo "Done "
			}		
		}
		stage('Deployment in Staging') {
			agent any
			options {
                // Don't need to checkout Git again
                skipDefaultCheckout true
            }
			steps {
				// Deploy to Staging environment calling the deployment script
				sh './jenkins/deploy/deploy-staging.sh'
			}
		}
		stage('Dredd API validation') {
			agent any
			steps {
				sh './jenkins/dredd/run-api-test.sh'
			}
		}
		stage('Production image creation') {
            agent any
            steps {                
                // Change the tag from staging to production 
                sh "docker tag ditas/data-utility-resolution-engine:staging ditas/data-utility-resolution-engine:production"
                sh "docker push ditas/data-utility-resolution-engine:production"
            }
        }
		stage('Deployment in Production') {
            agent any
            steps {
                sh './jenkins/deploy/deploy-production.sh'
            }
		}
	}
}