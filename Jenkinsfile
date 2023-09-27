def dockerappFrontend
def dockerappBackend

pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = '734852411649'  
        AWS_DEFAULT_REGION = 'us-east-1' 
    }

    stages {
        stage('SonarQube Analysis') {
            steps {
                node {
                    stage('SCM') {
                        checkout scm
                    }
                    def scannerHome = tool 'SonarScanner';
                    withSonarQubeEnv() {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Authenticate with ECR') {
            steps {
                script {
                    def ecrAuth = sh(script: "aws ecr get-login-password --region ${AWS_DEFAULT_REGION}", returnStdout: true).trim()
                    sh "docker login -u AWS -p ${ecrAuth} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                }
            }
        }

        stage('Build Images') {
            steps {
                script {
                    dockerappFrontend = docker.build("734852411649.dkr.ecr.us-east-1.amazonaws.com/front:${env.BUILD_ID}", '-f ./front/Dockerfile ./front')
                    dockerappBackend = docker.build("734852411649.dkr.ecr.us-east-1.amazonaws.com/testestizza:${env.BUILD_ID}", '-f ./back/Dockerfile ./back')
                }
            }
        }

        stage('Push images to ECR') {
            steps {
                script {
                    withAWS(credentials: 'senha-senha', region: 'us-east-1') {
                        dockerappBackend.push('latest')
                        dockerappBackend.push("${env.BUILD_ID}")

                        dockerappFrontend.push('latest')
                        dockerappFrontend.push("${env.BUILD_ID}")
                    }
                }
            }
        }

        stage('Run Docker Containers') {
            steps {
                script {
                    def workspacePath = pwd()

                    def existingFrontendContainer = sh(script: 'docker ps -aqf name=osconectacont-frontend', returnStatus: true)
                    if (existingFrontendContainer == 0) {
                        sh 'docker stop osconectacont-frontend'
                        sh 'docker rm osconectacont-frontend'
                    }
                    def frontendContainer = docker.image("734852411649.dkr.ecr.us-east-1.amazonaws.com/front:${env.BUILD_ID}".toLowerCase()).run("-p 3000:3000 --name osconectacont-frontend")

                    def existingBackendContainer = sh(script: 'docker ps -aqf name=osconectacont-backend', returnStatus: true)
                    if (existingBackendContainer == 0) {
                        sh 'docker stop osconectacont-backend'
                        sh 'docker rm osconectacont-backend'
                    } 
                    def backendContainer = docker.image("734852411649.dkr.ecr.us-east-1.amazonaws.com/testestizza:${env.BUILD_ID}".toLowerCase()).run("-p 3048:3048 --name osconectacont-backend")
                }
            }
        }
    }
}
