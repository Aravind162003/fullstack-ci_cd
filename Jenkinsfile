pipeline {
    agent any

    environment {
        IMAGE_REPO = "aravind2003/ci-cd-fs"
    }

    stages {

        stage('Clone Code') {
            steps {
                git 'https://github.com/Aravind162003/fullstack-ci_cd.git'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh '''
                docker build \
                  -t $IMAGE_REPO:frontend-${BUILD_NUMBER} \
                  -t $IMAGE_REPO:frontend-latest \
                  ./frontend
                '''
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh '''
                docker build \
                  -t $IMAGE_REPO:backend-${BUILD_NUMBER} \
                  -t $IMAGE_REPO:backend-latest \
                  ./backend
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh '''
                docker push $IMAGE_REPO:frontend-${BUILD_NUMBER}
                docker push $IMAGE_REPO:frontend-latest

                docker push $IMAGE_REPO:backend-${BUILD_NUMBER}
                docker push $IMAGE_REPO:backend-latest
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                sed -i "s|image:.*frontend.*|image: $IMAGE_REPO:frontend-${BUILD_NUMBER}|" k8s/frontend-deployment.yaml
                sed -i "s|image:.*backend.*|image: $IMAGE_REPO:backend-${BUILD_NUMBER}|" k8s/backend-deployment.yaml

                kubectl apply -f k8s/mongo-deployment.yaml
                kubectl apply -f k8s/mongo-service.yaml

                kubectl apply -f k8s/backend-deployment.yaml
                kubectl apply -f k8s/backend-service.yaml

                kubectl apply -f k8s/frontend-deployment.yaml
                kubectl apply -f k8s/frontend-service.yaml
                '''
            }
        }
    }

    post {
        success {
            echo "✅ MERN application deployed successfully to Kubernetes"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
