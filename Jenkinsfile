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
                sh 'echo "Node version:" && node --version'
                sh 'echo "Playwright version:" && npx playwright --version'
            }
        }
        stage(" CLONE DU PROJET"){
            steps{
                sh "rm -rf repo"
                sh "npx playwright test --project=chromium"
            }
        }
   
}

}


 