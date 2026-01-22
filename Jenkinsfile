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
                        sh 'rm -rf repo25'
                        sh 'git clone https://github.com/admanehocine/PlaywrightJenkins.git repo25'
                    }
                }
                stage('install deps') {
                    steps {
                        dir('repo25') {
                            sh 'npm ci'
                        }
                    }
                }
               stage('run tests') {
                    steps {
                        dir('repo25') {
                            script {
                                sh 'rm -rf allure-results'   // nettoyage TOTAL
                                sh 'mkdir -p allure-results'

                                if(params.ALLURE) {
                                    sh "npx playwright test --grep ${params.TAG} --reporter=allure-playwright"
                                    stash name: 'allure-results', includes: 'allure-results/**'
                                } else {
                                    sh "npx playwright test --grep ${params.TAG}"
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
                dir('repo25') {
                    sh 'rm -rf allure-results'
                    unstash 'allure-results'
                    archiveArtifacts artifacts: 'allure-results/**', fingerprint: true
                    allure results: [[path: 'allure-results']]
                }
            }
        }
    }
}

}
