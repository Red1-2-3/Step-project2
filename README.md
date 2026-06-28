# Step Project 2 — Jenkins CI/CD Pipeline

## Опис

Node.js Express додаток з автоматизованим CI/CD pipeline через Jenkins.

## Структура проєкту

```
step2-project/
├── index.js           # Express додаток
├── package.json       # Залежності
├── Dockerfile         # Production образ
├── Dockerfile.test    # Тестовий образ
├── Jenkinsfile        # CI/CD pipeline
├── Vagrantfile        # Дві VM: master + worker
└── test/
    └── app.test.js    # Jest тести
```

## Технології

- **Node.js** + Express
- **Jest** + Supertest — тестування
- **Docker** — контейнеризація
- **Jenkins** — CI/CD
- **Vagrant** + VirtualBox — віртуальні машини

## Pipeline

```
Pull Code → Build Docker Image → Run Tests
                                     ↓
                            PASS → Push to Docker Hub ✅
                            FAIL → "Tests failed" ❌
```

## Запуск локально

```bash
npm install
npm start        # http://localhost:80
npm test         # запуск тестів
```

## Запуск через Vagrant

```bash
vagrant up                    # запустити обидві VM
vagrant ssh jenkins-master    # підключитись до master
vagrant ssh jenkins-worker    # підключитись до worker
vagrant halt                  # зупинити VM
vagrant destroy               # видалити VM
```

## Jenkins

- Jenkins Master: `http://localhost:8080`
- Jenkins Worker: підключається через systemd сервіс
- Docker Hub credentials ID: `dockerhub-credentials`
