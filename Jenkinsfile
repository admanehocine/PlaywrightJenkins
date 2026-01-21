pipeline {
    //installer  l"environment
    //nodejs , playwright
    agent {
        docker {
            image 'playwright/chromium:playwright-1.56.1'
            args '--user=root --entrypoint=""'
        }
    }
    stages{
        stage(" VERIFICATION DE L'ENVIRONMENT"){
            steps{
                //check version node et playwright
                sh "node --version"
                sh "npx playwright --version"
            }
        }
        stage(" CLONE DU PROJET"){
            steps{
                //clone de  mon projet  le repo
                sh "git clone https://github.com/admanehocine/PlaywrightJenkins.git repo"
                sh "ls -la repo"
            }
        }
      
        stage(" EXECUTION DES TESTS"){
            steps{
                //acceder  au dossier repo
                dir('repo'){
                    sh "npm install"
                    sh "npx playwright test --project=chromium"
                }
            }
        }
    }

    //git clone
    //npm install
    //npx playwright test --project=chromium --grep=@smoke
}