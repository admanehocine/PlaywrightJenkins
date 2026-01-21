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
                            echo "Lancement tests Allure pour ${params.TAG}"
                            sh "npx playwright test --grep ${params.TAG} --reporter=allure-playwright"
                            stash name: 'allure-results', includes: 'allure-results/*'
                        } else {
                            echo "Lancement tests JUnit pour ${params.TAG}"
                            sh "npx playwright test --grep ${params.TAG} --reporter=junit"
                            stash name: 'junit-report', includes: 'playwright-report/junit/*'
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

                // Archivage et rapport Allure conditionnel
                script {
                    if (params.ALLURE) {
                        unstash 'allure-results'
                        archiveArtifacts artifacts: 'allure-results/*', fingerprint: true
                        allure(
                            includeProperties: false,
                            jdk: '',
                            results: [[path: 'allure-results/']]
                        )
                    } else {
                        unstash 'junit-report'
                        junit 'playwright-report/junit/results.xml'
                    }
                }
            }
        }
    }
}
