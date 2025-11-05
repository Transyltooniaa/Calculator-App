# 🧮 Scientific Calculator Web Application 

A modern, responsive scientific calculator web application with a sleek UI, containerized deployment, and a complete CI/CD pipeline.

![Calculator App](https://img.shields.io/badge/Calculator-App-blueviolet)
![Node.js](https://img.shields.io/badge/Node.js-v20.x-green)
![Express](https://img.shields.io/badge/Express-v5.1.0-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![CI/CD](https://img.shields.io/badge/CI/CD-Jenkins-red)
![Test Coverage](https://img.shields.io/badge/Test%20Coverage-100%25-brightgreen)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Docker Containerization](#docker-containerization)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## 🔎 Overview

This Scientific Calculator is a robust web application that provides mathematical operations with a clean, intuitive interface. The app supports square root calculations, factorial computations, natural logarithms, and exponentiation. It features comprehensive error handling, responsive design, and a full testing suite.

## ✨ Features

- **Scientific Operations**:
  - Square Root (√x)
  - Factorial (x!)
  - Natural Logarithm (ln x)
  - Power (x^y)

- **User Interface**:
  - Clean, modern design with gradient background
  - Responsive layout (works on mobile and desktop)
  - Input validation with helpful error messages
  - Real-time operation switching with appropriate input fields

- **Error Handling**:
  - Comprehensive input validation (client and server-side)
  - Descriptive error messages
  - Special cases handling (negative inputs for sqrt/ln, etc.)

- **Technical Features**:
  - RESTful API endpoints
  - Modular architecture (MVC pattern)
  - Container-ready with Docker
  - Automated testing with Jest
  - CI/CD pipeline with Jenkins
  - Automated deployment with Ansible

## 🛠 Technology Stack

- **Frontend**:
  - HTML5 / CSS3 / JavaScript (ES6+)
  - EJS (Embedded JavaScript templates)
  
- **Backend**:
  - Node.js
  - Express.js (v5.1.0)
  
- **Testing**:
  - Jest

- **DevOps**:
  - Docker
  - Jenkins
  - Ansible
  
- **Deployment**:
  - Container deployment
  - Docker Hub for image registry

## 📂 Project Structure

```
/
├── Dockerfile            # Docker containerization configuration
├── Jenkinsfile          # CI/CD pipeline configuration
├── package.json         # Node.js dependencies and scripts
├── ansible/             # Deployment automation
│   ├── deploy.yml       # Ansible deployment playbook
│   └── inventory.ini    # Deployment targets configuration
├── src/                 # Application source code
│   ├── app.js           # Express application setup
│   ├── index.js         # Application entry point
│   ├── controllers/     # Request handlers
│   │   └── calcController.js
│   ├── public/          # Static assets
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       └── calculator.js
│   ├── routes/          # API route definitions
│   │   ├── calc.js      # Calculator API routes
│   │   └── ui.js        # Frontend routes
│   ├── services/        # Business logic
│   │   └── calcService.js
│   └── views/           # EJS templates
│       └── index.ejs    # Main calculator interface
└── test/                # Test suite
    └── calcService.test.js
```

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Docker (optional, for containerized deployment)
- Ansible (optional, for automated deployment)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Transyltooniaa/Calculator-App.git
cd Calculator-App
```

2. Install dependencies:

```bash
npm install
```

## 🏃 Running Locally

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

For production mode:

```bash
npm start
```

## 📚 API Documentation

### Calculator API Endpoints

#### GET `/calc`

Performs calculations via query parameters.

**Parameters:**
- `op` (required): Operation type - one of `sqrt`, `fact`, `ln`, `pow`
- `a` (required): First operand
- `b` (required for `pow`): Second operand

**Example Request:**
```
GET /calc?op=sqrt&a=16
```

**Example Response:**
```json
{
  "op": "sqrt",
  "a": 16,
  "result": 4
}
```

#### POST `/calc`

Performs calculations via JSON request body.

**Request Body:**
```json
{
  "op": "pow",
  "a": 2,
  "b": 8
}
```

**Example Response:**
```json
{
  "op": "pow",
  "a": 2,
  "b": 8,
  "result": 256
}
```

### Error Handling

The API returns appropriate status codes and error messages:

- `400 Bad Request`: When inputs are invalid or the operation cannot be performed
- `500 Internal Server Error`: For server-side issues

**Example Error Response:**
```json
{
  "error": "Square root of negative number is undefined"
}
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

With coverage report:

```bash
npm run test:cov
```

Watch mode for development:

```bash
npm run test:watch
```

## 🐳 Docker Containerization

### Building the Image

```bash
docker build -t calculator-app .
```

### Running the Container

```bash
docker run -p 3000:3000 calculator-app
```

The application will be available at http://localhost:3000

### Docker Image on DockerHub

The application is available as a Docker image on DockerHub:

```bash
docker pull transyltoonia/calculator-app:latest
```

## 🔄 CI/CD Pipeline

The project uses Jenkins for continuous integration and continuous deployment.

### Pipeline Stages:

1. **Checkout**: Retrieves the latest code from the repository
2. **Install**: Installs project dependencies
3. **Test**: Runs the test suite with coverage reporting
4. **Docker Diagnostics**: Validates Docker installation
5. **Build Image**: Creates the Docker image
6. **Push Image**: Pushes the image to Docker Hub
7. **Use Ansible to Deploy**: Deploys the container to target environments

## 📦 Deployment

The application is deployed using Ansible, which automates the deployment process:

1. Removes any existing containers
2. Pulls the latest image from Docker Hub
3. Creates and runs a new container

### Manual Deployment

To deploy manually using Ansible:

```bash
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```

## 📸 Screenshots

<img width="1920" height="1080" alt="Screenshot 2025-10-08 at 23 10 30" src="https://github.com/user-attachments/assets/29210c57-eb5d-41ea-8cfe-d1ea5275dc34" />
<img width="1920" height="1080" alt="Screenshot 2025-10-08 at 23 10 20" src="https://github.com/user-attachments/assets/4219db15-046f-4ecb-9c42-d2aff3c74fb0" />
<img width="1920" height="1080" alt="Screenshot 2025-10-08 at 23 09 47" src="https://github.com/user-attachments/assets/3a26985c-4dc0-4222-a788-28f31e4cad5f" />

## 🚧 Future Improvements

- Additional mathematical operations (trigonometric functions, etc.)
- History feature to recall previous calculations
- User accounts to save calculation history
- Dark/light mode toggle
- Mobile app versions using technologies like React Native

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
