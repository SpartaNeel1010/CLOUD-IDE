
# Collaborative Cloud IDE
[Youtube Video](https://www.youtube.com/watch?v=Xwkg_IPgvFg)

Welcome to the **Collaborative Cloud IDE**! This project is an online integrated development environment (IDE) designed for seamless coding, real-time collaboration, and persistent development environments. Leveraging cutting-edge technologies such as Docker, Kubernetes, and AWS, the Cloud IDE empowers developers to collaborate effectively from anywhere.

## Features

### 1. **Isolated Coding Environments**
- Implemented a scalable collaborative online coding platform with multi-user support, similar to Replit, enabling real-time
  code sharing, and collaboration.
- Provisioned dedicated pods for each user to ensure an isolated development environment and utilized Kubernetes ingress
  controllers to dynamically route user-specific requests to corresponding pods.

### 2. **Real-Time Collaboration**
- Multiple users can collaborate on the same project in real-time.
- Changes made by collaborators are reflected instantly via WebSocket communication.

### 3. **Persistent Projects**
- All files and configurations are stored in **AWS S3**, ensuring continuity across sessions.
- Retrieve previous projects with all dependencies intact.

### 4. **AI-Powered Coding Assistant**
- Integrated AI assistant powered by project-specific files.
- Provides contextual guidance and query-based code generation.

### 5. **Microservices Architecture**
- Divided into dedicated services:
  - **Authentication**: Secure user login and management.
  - **Resource Provisioning**: Handles container creation and scaling.
  - **Coding Interface**: Manages WebSocket and REST communication between frontend and backend.

### 6. **Rich Coding Experience**
- Live code execution with error feedback and output displayed in the IDE.
- Integrated version control support within the browser-based platform.

## Project Highlights

### Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Cloud Services**: AWS ECS, S3
- **AI Integration**: Project-specific coding assistant

### Scalability
- Kubernetes ensures that user environments scale dynamically based on demand, maintaining consistent performance.

### Secure Collaboration
- Isolated containers for every user to ensure data privacy and environment independence.

## Requirements
### Functional Requirements
- Multi-user support with unique profiles.
- Shared coding environments for team projects.
- Persistent storage for files, settings, and dependencies.

### Non-Functional Requirements
- High scalability and fault tolerance.
- Secure user access and data isolation.
- Smooth performance under heavy traffic.

## Screenshots
### Login Page
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Screenshot%202024-11-15%20145525.png)

### Project Page
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Screenshot%20(414).png)

### Project Creation
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Screenshot%20(413).png)

### Coding Interface - 1
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Screenshot%20(418).png)

### Node JS application running
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Screenshot%20(430).png)

### AI Assistant 
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Screenshot%20(426).png)

### AI Assistant - 2
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Screenshot%20(427).png)

## Copy base file from S3 to Project's folder
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Arch-S3-Copy.png)

### Kubernetes Initial State
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Arch-k8s-inital.png)

## Resource Provisioning API
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Arch-res-proven-api.png)

### Frontend device and Backend pod connection
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Arch-communication.png)

## Multiple User Collaboration
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Arch-multiple-users.png)

## Microservices Architecture
![App Screenshot](https://raw.githubusercontent.com/SpartaNeel1010/CLOUD-IDE/refs/heads/main/Images/Arch-microservices.png)





## Installation and Setup

### Prerequisites
- AWS account with access to S3 and ECS.
- Docker installed in your computer
- MongoDB database database connection

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/SpartaNeel1010/CLOUD-IDE
   cd cloud-ide
   ```

2. **Install Dependencies**
   ```bash
   cd Authentication
   npm i
   node index.js
   ```
   ```bash
   cd Server
   npm i
   node index.js
   ```
    ```bash
   cd Client
   npm run dev
   ```


3. **Setup Environment Variables**
    

   Configure the following in a `.env` file in the server folder and :
   - `MONGO_URI`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `S3_BUCKET_NAME`

4. **Run Services**
   ```bash
   - Build docker image using docker files in all the three folders 
   - Run containers for each docker images 

   ```

5. **Access the Frontend on**
   Open `http://localhost:5173` in your browser.

