pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.57.0-noble'
            // On utilise l'UID actuel de Jenkins pour éviter les problèmes de permission
            args "-u 1000:1000 --entrypoint="
            reuseNode true
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
                sh 'rm -rf repo'
                sh 'git clone https://github.com/admanehocine/PlaywrightJenkins.git repo'
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
                            chmod -R 777 allure-results
                        """
                    } else {
                        echo "ALLURE = false, aucun rapport Allure généré"
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
                    // Archive directement sans stash/unstash
                    archiveArtifacts artifacts: 'repo/allure-results/*', allowEmptyArchive: true
                    allure includeProperties: false,
                           jdk: '',
                           results: [[path: 'repo/allure-results/']]
                }
            }
        }
    }
}
