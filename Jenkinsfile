pipeline {
    agent any

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
                echo "Clonage du repo et installation des dépendances"
                sh 'rm -rf repo'
                sh 'git clone https://github.com/admanehocine/PlaywrightJenkins.git repo'
                sh """
                    cd ${WORKDIR}
                    npm ci
                    npx playwright install --with-deps
                """
            }
        }

        stage('Run Tests in Docker') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '-u root --entrypoint='
                }
            }
            steps {
                script {
                    echo "Exécution des tests pour le tag ${params.TAG}"
                    if (params.ALLURE) {
                        sh """
                            cd ${WORKDIR}
                            chmod -R 777 .
                            npx playwright test --grep ${params.TAG} --reporter=allure-playwright
                        """
                        stash name: 'allure-results', includes: 'repo/allure-results/*'
                    } else {
                        sh """
                            cd ${WORKDIR}
                            npx playwright test --grep ${params.TAG}
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (params.ALLURE) {
                    echo "Archivage des résultats Allure"
                    unstash 'allure-results'
                    archiveArtifacts artifacts: 'repo/allure-results/*', allowEmptyArchive: true
                    allure includeProperties: false,
                           jdk: '',
                           results: [[path: 'repo/allure-results/']]
                } else {
                    echo "Pas de rapport Allure à archiver"
                }
            }
        }
    }
}
