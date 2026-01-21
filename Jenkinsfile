pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.57.0-noble'
            args '-u root --entrypoint='
        }
    }

    parameters {
        choice(
            name: 'TAG',
            choices: ['@smoke', '@valide', '@invalide', '@regression'],
            description: 'Choisir le tag de test à exécuter'
        )
        booleanParam(
            name: 'ALLURE',
            defaultValue: false, // par défaut false
            description: 'Génération de rapport Allure'
        )
    }

    stages {
        stage('Clone & Install deps') {
            steps {
                sh 'rm -rf repo'
                sh 'git clone https://github.com/admanehocine/PlaywrightJenkins.git repo'
                sh '''
                    cd repo
                    npm ci
                    npx playwright install --with-deps
                '''
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    if (params.ALLURE) {
                        echo "Lancement des tests avec Allure pour le tag ${params.TAG}"
                        sh "cd repo && npx playwright test --grep ${params.TAG} --reporter=allure-playwright"
                        
                        // Fix permissions pour éviter les erreurs
                        sh 'chmod -R 777 repo/allure-results'
                        stash name: 'allure-results', includes: 'repo/allure-results/*'
                    } else {
                        echo "ALLURE = false, aucun rapport Allure généré"
                        sh "cd repo && npx playwright test --grep ${params.TAG}"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (params.ALLURE) {
                    unstash 'allure-results'
                    archiveArtifacts 'repo/allure-results/*'
                    allure includeProperties: false,
                           jdk: '',
                           results: [[path: 'repo/allure-results/']]
                }
            }
        }
    }
}
