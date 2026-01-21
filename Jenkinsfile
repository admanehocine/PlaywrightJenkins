
            //image 'playwright/chromium:playwright-1.56.1'
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.56.1-jammy'
            args '--user=root --entrypoint=""'
        }
    }

    parameters {
        choice(
            name: 'TAG', 
            choices: ['@smoke', '@valide', '@invalide'], 
            description: 'Choisir le tag de test à exécuter'
        )
        booleanParam(
            name: 'ALLURE', 
            defaultValue: true, 
            description: 'Générer le rapport Allure'
        )
    }

    stages {
        stage('Display versions') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'git --version'
            }
        }

        stage('Clone & Install') {
            steps {
                sh 'rm -rf repo'
                sh 'git clone https://github.com/admanehocine/PlaywrightJenkins.git repo'
                sh 'ls -la repo'

                dir('repo') {
                    sh 'npm install'
                    sh 'npx playwright install --with-deps'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('repo') {
                    script {
                        if (params.ALLURE) {
                            echo "Lancement des tests avec Allure pour le tag ${params.TAG}"
                            sh "npx playwright test --grep ${params.TAG} --reporter=allure-playwright"
                        } else {
                            echo "Lancement des tests sans Allure pour le tag ${params.TAG}"
                            sh "npx playwright test --grep ${params.TAG} --reporter=junit"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo '📦 Archivage des rapports Playwright & Allure'
            dir('repo') {
                // Archivage Playwright HTML
                archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true

                // Archivage Allure si activé
                script {
                    if (params.ALLURE) {
                        archiveArtifacts artifacts: 'allure-results/**/*', fingerprint: true
                        allure(
                            includeProperties: false,
                            jdk: '',
                            results: [[path: 'allure-results']]
                        )
                    }
                }
            }
        }
    }
}

