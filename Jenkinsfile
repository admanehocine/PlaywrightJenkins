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
            defaultValue: false,
            description: 'Génération de rapport Allure'
        )
    }

    environment {
        WORKDIR = "${env.WORKSPACE}/repo"
    }

    stages {
        stage('Clone & Install deps') {
            steps {
                // Supprimer ancien repo
                sh 'rm -rf repo'

                // Cloner le repo directement dans le conteneur
                sh 'git clone https://github.com/admanehocine/PlaywrightJenkins.git repo'

                // Installer npm et Playwright
                sh """
                    cd ${WORKDIR}
                    npm ci
                    npx playwright install --with-deps
                """
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    if (params.ALLURE) {
                        echo "Lancement des tests avec Allure pour le tag ${params.TAG}"
                        sh """
                            cd ${WORKDIR}
                            npx playwright test --grep ${params.TAG} --reporter=allure-playwright
                        """
                    } else {
                        echo "ALLURE = false, exécution simple sans rapport"
                        sh "cd ${WORKDIR} && npx playwright test --grep ${params.TAG}"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (params.ALLURE) {
                    archiveArtifacts artifacts: 'repo/allure-results/*', allowEmptyArchive: true
                    allure includeProperties: false,
                           jdk: '',
                           results: [[path: 'repo/allure-results/']]
                }
            }
        }
    }
}
