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

    stages {
        stage('Install deps') {
            steps {
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
                        echo "ALLURE = false, exécution simple"
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
                    // On s'assure que les fichiers Allure sont accessibles
                    sh "chmod -R 777 ${WORKDIR}/allure-results || true"

                    // Archiver les résultats
                    archiveArtifacts artifacts: 'allure-results/*', allowEmptyArchive: true

                    // Générer le rapport Allure
                    allure includeProperties: false,
                           jdk: '',
                           results: [[path: 'allure-results/']]
                }
            }
        }
    }
}
