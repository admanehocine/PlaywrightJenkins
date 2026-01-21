pipeline {
    agent {
        docker {
            image 'playwright/chromium:playwright-1.56.1'
            args '--user=root --entrypoint=""'
        }
    }

    stages {
        stage('Display versions') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }
        stage(" CLONE DU PROJET"){
            steps{
                sh "rm -rf repo"
                sh "git clone https://github.com/admanehocine/PlaywrightJenkins.git repo"
                sh "ls -la repo"
                  dir('repo'){
                    sh "npm install"
                    sh "npx playwright install"
                    sh "npx playwright test --project=chromium"
                }
            }
        }
        
      
    }
   
}


 