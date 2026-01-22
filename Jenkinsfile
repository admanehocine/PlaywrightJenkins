pipeline {
    agent any
    parameters {
        //variable pour choisir le tag de test
        choice(name: 'TAG', choices: ['@regression', '@smoke'])
        //variable pour generer le rapport allure
        booleanParam(name: 'ALLURE', defaultValue: false, description: 'generation de rapport allure')
    }
    stages {
        stage('global stage') {
            agent {
                docker {
                    //Utilisation de l'image Docker pour Playwright
                    image 'mcr.microsoft.com/playwright:v1.57.0-noble'
                    //donner les droits root et redefinir le entrypoint
                    args '-u root --entrypoint='
                }
            }
            stages {
                stage('Checkout') {
                    steps {
                        // Supprimer le dossier repo25 s'il existe déjà
                        sh 'rm -rf repo25'
                        // Cloner le dépôt dans le dossier repo25
                        sh 'git clone https://github.com/admanehocine/PlaywrightJenkins.git repo25'
                    }
                }
                stage('install deps') {
                    steps {
                        //acceder au dossier repo25
                        dir('repo25') {
                            //installer les dependances
                            sh 'npm ci'
                        }
                    }
                }
               stage('run tests') {
                    steps {
                        //acceder au dossier repo25
                        dir('repo25') {
                            script {
                                //vider le dossier allure-results avant chaque execution
                                sh 'rm -rf allure-results'
                                //creer le dossier allure-results
                                sh 'mkdir -p allure-results'

                                if(params.ALLURE) {
                                    //lancer test avec allure report
                                    sh "npx playwright test --grep ${params.TAG} --reporter=allure-playwright"
                                    //stocker les resultats dans un stash pour les utiliser dans la section post
                                    stash name: 'allure-results', includes: 'allure-results/**'
                                } else {
                                    //lancer test sans allure report
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
            //verifier si le rapport allure doit etre genere
            if(params.ALLURE) {
                //acceder au dossier repo25
                dir('repo25') {
                    //restaurer la copie de allure-results
                    sh 'rm -rf allure-results'
                    //recuperer les resultats stashés dans allure-results
                    unstash 'allure-results'
                    //archiver les resultats et generer le rapport allure
                    archiveArtifacts artifacts: 'allure-results/**', fingerprint: true
                    allure results: [[path: 'allure-results']]
                }
            }
        }
    }
}

}
