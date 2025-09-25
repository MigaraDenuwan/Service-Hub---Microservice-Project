# 🛠️ Service Hub - Microservice Project

Service Hub is a full-stack microservice-based service management system. It includes three backend services and a React/TypeScript frontend for two user types: **customers** and **service providers**.

---

## 📦 Tech Stack

### Frontend
- **React.js** (with TypeScript)

### Backend Microservices
1. **User Service** – Spring Boot + MongoDB  
2. **Provider Service** – Node.js + MongoDB  
3. **Appointment Service** – Node.js + PostgreSQL

### Infrastructure
- Docker
- Docker Compose
- Kubernetes
- Minikube (optional)
- MongoDB & PostgreSQL

---

## 📂 Project Structure

```
Microservice Project/
├── Backend/
│   ├── user-service/
│   ├── provider-service/
│   ├── appointment-service/
│   ├── k8s/
│   └── docker-compose.yml
└── Frontend/
```

---

## 🧾 Prerequisites

Ensure the following are installed:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Minikube](https://minikube.sigs.k8s.io/docs/)
- [Node.js](https://nodejs.org/)
- [Java 21](https://adoptopenjdk.net/)
- [PostgreSQL](https://www.postgresql.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

---

## 🔁 Clone the Project

```bash
git clone https://github.com/your-username/service-hub.git
cd service-hub
```

---

## 🚀 How to Run the Project

### Using Docker Compose (Recommended for Local Development)

```bash
cd Backend
docker-compose up --build
```

To stop the services:

```bash
docker-compose down
```

---

## 🐳 Using Docker Manually (Optional)

Build Docker images:

```bash
docker build -t user-service ./user-service
docker build -t provider-service ./provider-service
docker build -t appointment-service ./appointment-service
```

Run containers:

```bash
docker run -d --name mongo -p 27017:27017 mongo
docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=admin postgres
```

---

## ☸️ Using Kubernetes (Minikube or K8s Cluster)

### Start Minikube

```bash
minikube start
```

### Deploy Services

```bash
cd Backend/k8s
kubectl apply -f mongo-deployment.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f user-deployment.yaml
kubectl apply -f provider-deployment.yaml
kubectl apply -f appointment-deployment.yaml
```

### Check Pods and Services

```bash
kubectl get pods
kubectl get services
kubectl get deployments
```

### Port Forward (example)

```bash
kubectl port-forward service/user-service 8080:8080
```

### Delete All Deployments

```bash
kubectl delete -f .
```

---

## 🌐 Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend will run at `http://localhost:5173`.

---

## 💻 Installing Node Modules

Each Node.js service has its own dependencies:

```bash
cd Backend/provider-service
npm install

cd Backend/appointment-service
npm install
```

---

## 🔄 Restarting & Rebuilding

### Restart Docker Compose

```bash
docker-compose down
docker-compose up --build
```

### Clean Kubernetes and Restart

```bash
kubectl delete -f .
kubectl apply -f .
```

---

## 🧪 Testing Microservices

- You can use tools like [Postman](https://www.postman.com/) to test the REST APIs.
- Swagger can be added for API documentation (optional feature).

---

## 👥 Users

- **Customer:** Register, browse providers, make appointments.
- **Provider:** Register, list services, manage appointments.

---

## 📫 Contact

For queries or improvements, feel free to contribute or contact the maintainer.

---

