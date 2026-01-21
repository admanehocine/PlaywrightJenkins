pipeline {
    agent any
    parameters {
        choice(name: 'TAG', choices: ['@regression', '@smoke'])
        booleanParam(name: 'ALLURE', defaultValue: false, description: 'generation de rapport allure')
    }
    stages {
        stage('global stage') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    args '-u root --entrypoint='
                }
            }
            stages {
                stage('Checkout') {
                    steps {
                        // Supprimer le dossier repo s'il existe
                        sh 'rm -rf repo'
                        // Cloner le repo
                        sh 'git clone https://github.com/admanehocine/PlaywrightJenkins.git repo'
                    }
                }
                stage('install deps') {
                    steps {
                        dir('repo') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('run smoke test') {
                    steps {
                        dir('repo') {
                            sh 'npx playwright test --grep @smoke'
                        }
                    }
                }
                stage('run user test') {
                    steps {
                        dir('repo') {
                            script {
                                if(params.ALLURE) {
                                    sh "npx playwright test --grep ${params.TAG} --reporter=allure-playwright"
                                    stash name: 'allure-results', includes: 'allure-results/*'
                                } else {
                                    sh "npx playwright test --grep ${params.TAG} --reporter=junit"
                                    stash name: 'junit-report', includes: 'playwright-report/junit/*'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                if(params.ALLURE) {
                    unstash 'allure-results'
                    archiveArtifacts 'allure-results/*'
                    allure includeProperties: false,
                           jdk: '',
                           results: [[path: 'allure-results/']]
                }
                // Optionnel : gérer junit
                // else {
                //     unstash 'junit-report'
                //     junit 'playwright-report/junit/results.xml'
                // }
            }
        }
    }
}
