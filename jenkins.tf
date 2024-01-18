pipeline {
    agent any
    tools {
        jdk 'jdk17'
        nodejs '16.20.0'
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }
    stages {
        stage('clean workspace') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout HTML from Git') {
            steps {
                git branch: 'main', url: 'https://github.com/harsh8525/html.git'
            }
        }
        stage("Sonarqube Analysis ") {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=HTMLProject \
                        -Dsonar.projectKey=HTMLProject'''
                }
            }
        }
        stage("quality gate") {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token'
                }
            }
        }
        stage('OWASP FS SCAN') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage('Docker Scout FS') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh 'docker-scout quickview fs://.'
                        sh 'docker-scout cves fs://.'
                    }
                }
            }
        }
        stage("Docker Build & Push") {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh "docker build -t agola ."
                        sh "docker tag html_project ai8998aiatpl/agola:latest "
                        sh "docker push ai8998aiatpl/agola:latest"
                    }
                }
            }
        }
        stage('Docker Scout Image') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh 'docker-scout quickview ai8998aiatpl/agola:latest'
                        sh 'docker-scout cves ai8998aiatpl/agola:latest'
                        sh 'docker-scout recommendations ai8998aiatpl/agola:latest'
                    }
                }
            }
        }
        stage("deploy_docker") {
            steps {
                sh "docker run -itd --name agola --restart always -p 8001:80 ai8998aiatpl/agola:latest /bin/bash"
                sh "docker exec agola service apache2 restart"

            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    dir('K8S') {
                        withKubeConfig(caCertificate: '', clusterName: '', contextName: '', credentialsId: 'k8s', namespace: '', restrictKubeConfigAccess: false, serverUrl: '') {
                            sh 'kubectl apply -f deployment.yml'
                            sh 'kubectl apply -f service.yml'
                        }
                    }
                }
            }
        }
    }
}
