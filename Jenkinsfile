pipeline {
    agent any

    stages {
        stage('Build Image') {
            steps {
                script {
                    def dockerfile = './Dockerfile' // Caminho para o Dockerfile
                    def imageName = "dinahdoria/osconecta:v3" // Nome da imagem

                    dockerapp = docker.build(imageName)
                    dockerapp.dockerfile dockerfile
                }
            }
        }
    }
}
