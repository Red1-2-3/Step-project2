pipeline {
    agent { label 'docker-worker' } // 1. Виправлено Label ноди

    environment {
        DOCKERHUB_USER  = 'andriyg1231'
        IMAGE_NAME      = "${DOCKERHUB_USER}/step2-app"
        IMAGE_TAG       = "${BUILD_NUMBER}"
        
        // Переконайся, що в Credentials ID саме 'dockerhub-credentials'
        DOCKERHUB_CREDS = credentials('dockerhub-credentials')
    }

    stages {
        stage('Pull Code') {
            steps {
                echo '=== Pulling source code from GitHub ==='
                git branch: 'main',
                    url: 'https://github.com/Red1-2-3/Step-project2.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "=== Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG} ==="
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
            }
        }

        stage('Run Tests') {
            steps {
                echo '=== Running tests inside Docker container ==='
                sh "docker build -f Dockerfile.test -t ${IMAGE_NAME}:test ."
                sh """
                    docker run --rm \
                        --name test-runner-${BUILD_NUMBER} \
                        ${IMAGE_NAME}:test
                """
            }
        }
    }

    post {
        success {
            echo '=== Tests PASSED — pushing image to Docker Hub ==='
            sh """
                echo "${DOCKERHUB_CREDS_PSW}" | \
                    docker login -u "${DOCKERHUB_CREDS_USR}" --password-stdin
                docker push ${IMAGE_NAME}:${IMAGE_TAG}
                docker push ${IMAGE_NAME}:latest
                docker logout
            """
            echo "Image pushed: ${IMAGE_NAME}:${IMAGE_TAG}"
        }

        failure {
            echo '=== Build/Tests FAILED ==='
        }

        cleanup {
            sh """
                docker rmi ${IMAGE_NAME}:test || true
                docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true
                docker rmi ${IMAGE_NAME}:latest || true
            """
        }
    }
}