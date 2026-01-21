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
                sh 'apt-get update && apt-get install -y git'
                sh "rm -rf repo"
                echo 'version du git'
                sh 'git --version'
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
   post {
        always {
            // Archiver les résultats
            archiveArtifacts artifacts: 'repo/results/*.*', fingerprint: true
            junit 'repo/results/*.xml'
        }
    }
}


 