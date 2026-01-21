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
                        sh 'rm -rf repo'
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
                stage('run tests') {
                    steps {
                        dir('repo') {
                            script {
                                if(params.ALLURE) {
                                    echo "Lancement des tests avec Allure pour le tag ${params.TAG}"
                                    sh "npx playwright test --grep ${params.TAG} --reporter=allure-playwright"
                                    stash name: 'allure-results', includes: 'allure-results/*'
                                } else {
                                    echo "Lancement des tests sans Allure pour le tag ${params.TAG}"
                                    sh "npx playwright test --grep ${params.TAG}"
                                    //stash name: 'junit-report', includes: 'playwright-report/junit/*'
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
                    sh 'rm -rf allure-results/*'
                    unstash 'allure-results'
                    archiveArtifacts 'allure-results/*'
                    allure includeProperties: false,
                           jdk: '',
                           results: [[path: 'allure-results/']]
                }
            }
        }
    }
}
