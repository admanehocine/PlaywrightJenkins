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
        stage("CREATION DU REPO"){
            steps{
                //creer supprimer  le repo
                sh "rm -rf repo"
            }
        }
        stage(" CLONE DU PROJET"){
            steps{
                //clone de  mon projet  le repo
                sh "git clone https://github.com/admanehocine/PlaywrightJenkins.git repo"
            }
        }
        stage(" VERIFICATION DE L'ENVIRONMENT"){
            steps{
                //check version node et playwright
                sh "echo 'node --version'"
                sh "echo 'npx playwright --version'"
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