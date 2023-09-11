pipeline {
    agent any

    stages {
        stage('Build Image') {
            steps {
                script {
                    dockerapp = docker.build("dinahdoria/osconecta:${env.BUILD_ID}", '-f ./Dockerfile ./')
                }
            }
        }

        stage ('Push Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub'){
                        dockerapp.push('latest')
                        dockerapp.push("${env.BUILD_ID}")
                    }
                }
            }
        }

        stage ('Deploy Docker') {
            steps {
                script {
                    def existingContainer = sh(script: 'docker ps -aqf name=osconectacont', returnStatus: true)
                    if (existingContainer == 0) {
                        sh 'docker stop osconectacont'
                        sh 'docker rm osconectacont'
                    }
                    dockerapp.run('-p 3000:3000 --name osconectacont --rm')
                    }
                }
            }
        }
    }
