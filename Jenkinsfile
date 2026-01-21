
            //image 'playwright/chromium:playwright-1.56.1'
 pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.56.1-jammy'
            args '--user=root --entrypoint=""'
        }
    }

    stages {
        stage('Display versions') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'git --version'
            }
        }

        stage('CLONE DU PROJET') {
            steps {
                sh 'rm -rf repo'
                sh 'git clone https://github.com/admanehocine/PlaywrightJenkins.git repo'
                sh 'ls -la repo'

                dir('repo') {
                    sh 'npm install'
                    sh 'npx playwright install --with-deps'
                    sh 'npx playwright test --project=chromium'
                }
            }
        }
    }

    post {
        always {
            echo '📦 Archivage des rapports Playwright & Allure'

            // Allure results
            archiveArtifacts artifacts: 'repo/allure-results/**/*', fingerprint: true

            // Playwright HTML report
            archiveArtifacts artifacts: 'repo/playwright-report/**/*', fingerprint: true

            // Allure Jenkins Plugin
            allure(
                includeProperties: false,
                jdk: '',
                results: [[path: 'repo/allure-results']]
            )

            // HTML Playwright Report
            publishHTML([
                reportDir: 'repo/playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report',
                keepAll: true,
                alwaysLinkToLastBuild: true
            ])
        }
    }
}
