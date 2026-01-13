pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "aravind2003/ci-cd-fs"
        BACKEND_IMAGE  = "aravind2003/ci-cd-fs"
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
                docker build -t $FRONTEND_IMAGE:${BUILD_NUMBER} ./frontend
                '''
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh '''
                docker build -t $BACKEND_IMAGE:${BUILD_NUMBER} ./backend
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh '''
                docker push $FRONTEND_IMAGE:${BUILD_NUMBER}
                docker push $BACKEND_IMAGE:${BUILD_NUMBER}
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                sed -i "s|image:.*mern-frontend.*|image: $FRONTEND_IMAGE:${BUILD_NUMBER}|" k8s/frontend-deployment.yaml
                sed -i "s|image:.*mern-backend.*|image: $BACKEND_IMAGE:${BUILD_NUMBER}|" k8s/backend-deployment.yaml

                kubectl apply -f k8s/frontend-deployment.yaml
                kubectl apply -f k8s/frontend-service.yaml

                kubectl apply -f k8s/backend-deployment.yaml
                kubectl apply -f k8s/backend-service.yaml
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
