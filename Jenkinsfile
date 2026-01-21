pipeline {
    agent any

    parameters {
        choice(
            name: 'TAG',
            choices: ['@regression', '@smoke', '@valide', '@invalide'],
            description: 'Choisir le tag de test à exécuter'
        )
        booleanParam(
            name: 'ALLURE',
            defaultValue: false,
            description: 'Génération de rapport Allure'
        )
    }

    stages {
        stage('Run Tests in Docker') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '-u root --entrypoint='
                }
            }
            steps {
                script {
                    // Forcer les permissions pour éviter les erreurs sur node_modules / allure-results
                    sh 'chmod -R 777 .'

                    if (params.ALLURE) {
                        echo "Lancement des tests avec Allure pour le tag ${params.TAG}"
                        sh "npx playwright test --grep ${params.TAG} --reporter=allure-playwright"
                        sh 'chmod -R 777 allure-results'
                        stash name: 'allure-results', includes: 'allure-results/*'
                    } else {
                        echo "Lancement des tests sans Allure pour le tag ${params.TAG}"
                        sh "npx playwright test --grep ${params.TAG} --reporter=junit"
                        stash name: 'junit-report', includes: 'playwright-report/junit/*'
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
                    archiveArtifacts artifacts: 'allure-results/*', allowEmptyArchive: true
                    allure includeProperties: false,
                           jdk: '',
                           results: [[path: 'allure-results/']]
                } else {
                    unstash 'junit-report'
                    archiveArtifacts artifacts: 'playwright-report/junit/*', allowEmptyArchive: true
                    junit 'playwright-report/junit/results.xml'
                }
            }
        }
    }
}
