# VOLTIX Deployment Guide (AWS Burner Account)

This guide provides a "safe" and reliable route to deploy the complete VOLTIX stack (Frontend, Backend, ML, Databases, and Blockhchain) to a single AWS EC2 instance. This approach is ideal for a "burner" account as it minimizes infrastructure complexity and costs while ensuring all components work together seamlessly.

## 🏗️ Architecture Overview

We will deploy a containerized stack using **Docker Compose**:

1.  **Frontend**: Next.js App (Port 3000)
2.  **Backend**: Node.js/Express App (Port 5000)
3.  **ML Service**: Python/FastAPI (Port 8000)
4.  **Blockchain**: Local Hardhat Node (Port 8545)
5.  **Redis**: Caching Layer (Port 6379, internal)
6.  **MongoDB**: External (Atlas) or Internal Container (configured below)

---

## 🚀 Step 1: Prepare the "Master" Docker Compose

Create a file named `docker-compose.yml` in the **root** of your project (same level as `my-app`, `backend`, `ml`).

```yaml
version: "3.8"

services:
  # ------------------------------------
  # 1. FRONTEND (Next.js)
  # ------------------------------------
  frontend:
    build:
      context: ./my-app
      dockerfile: Dockerfile
    container_name: voltix-frontend
    restart: always
    ports:
      - "80:3000" # Expose on standard HTTP port
    environment:
      - NEXT_PUBLIC_API_URL=http://<YOUR_EC2_IP>:5000
      - NEXT_PUBLIC_ML_API_URL=http://<YOUR_EC2_IP>:8000
    depends_on:
      - backend

  # ------------------------------------
  # 2. BACKEND (Node.js)
  # ------------------------------------
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: voltix-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGO_URI=${MONGO_URI} # Provide this in .env
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - JWT_SECRET=supersecretburnerkey
      - ML_SERVICE_URL=http://ml-service:8000
      - BLOCKCHAIN_RPC_URL=http://blockchain:8545
      # Contract address will be read from deployment.json if mounted, or you can set:
      # AUDIT_CONTRACT_ADDRESS=<Deploy first and set this>
    volumes:
      # Mount the deployment file so backend sees the deployed address
      - ./backend/deployment.json:/app/deployment.json
    depends_on:
      - redis
      - ml-service
      - blockchain
      - deployer # Wait for deployment to finish

  # ------------------------------------
  # 3. ML SERVICE (FastAPI)
  # ------------------------------------
  ml-service:
    build:
      context: ./ml
      dockerfile: docker/Dockerfile
    container_name: voltix-ml
    restart: always
    ports:
      - "8000:8000"
    environment:
      - ML_HOST=0.0.0.0
      - ML_PORT=8000
    volumes:
      - ./ml/saved_models:/app/saved_models
    depends_on:
      - redis

  # ------------------------------------
  # 4. BLOCKCHAIN (Local Hardhat Node)
  # ------------------------------------
  blockchain:
    image: ghcr.io/nomicfoundation/hardhat:latest
    container_name: voltix-blockchain
    command: ["npx", "hardhat", "node", "--hostname", "0.0.0.0"]
    expose:
      - "8545"
    ports:
      - "8545:8545"

  # ------------------------------------
  # 5. DEPLOYER (Runs once to deploy contracts)
  # ------------------------------------
  deployer:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: voltix-deployer
    # Overwrite the default command to run the deployment script
    command: ["node", "scripts/deploy-simple.js"]
    environment:
      - BLOCKCHAIN_RPC_URL=http://blockchain:8545
    volumes:
      # Write the result to the host so backend can read it
      - ./backend/deployment.json:/app/deployment.json
    depends_on:
      - blockchain
    restart: on-failure:5 # Retry if blockchain isn't ready yet

  # ------------------------------------
  # 6. REDIS (Cache)
  # ------------------------------------
  redis:
    image: redis:7-alpine
    container_name: voltix-redis
    restart: always
    expose:
      - "6379"
    volumes:
      - redis_data:/data

  # Optional: MongoDB
  # mongodb:
  #   image: mongo:latest
  #   ports:
  #     - "27017:27017"
  #   volumes:
  #     - mongo_data:/data/db

volumes:
  redis_data:
```

---

## 🛠️ Step 2: AWS Setup (The "Burner" Way)

1.  **Launch an EC2 Instance**:
    - **OS**: Ubuntu Server 22.04 LTS (Recommended: **t3.medium** or **t3.large**).
    - **Disk**: 20GB+ gp3.
    - **Security Group**: Allow Inbound Traffic for:
      - **SSH (22)**: Your IP
      - **HTTP (80)**: Anywhere (Frontend)
      - **Custom TCP (5000)**: Anywhere (Backend API)
      - **Custom TCP (8000)**: Anywhere (ML API)
      - **Custom TCP (8545)**: Anywhere (Blockchain RPC - Optional)

2.  **Connect to Instance**:
    ```bash
    ssh -i "your-key.pem" ubuntu@<EC2_PUBLIC_IP>
    ```

## 📦 Step 3: Deployment Script

Run these commands on your EC2 instance.

```bash
# 1. Update and Install Docker
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 2. Clone Your Repository
git clone https://github.com/KaranGupta2005/VOLTIX.git
cd VOLTIX
# Switch to the correct branch
git checkout varun-branch

# 3. Create Environment File (.env)
nano .env
# PASTE:
# MONGO_URI=mongodb+srv://... (Your Atlas URI)

# 4. Create the Master docker-compose.yml
# (Copy the content from Step 1 above into this file)
nano docker-compose.yml

# 5. Build and Launch
sudo docker compose up --build -d
```

## ✅ Everything Runs Automatically!

With this setup:

1.  **Blockchain** starts first.
2.  **Deployer** waits for blockchain, then deploys your smart contracts.
3.  **Backend** reads the new contract address from the shared `deployment.json` file.
4.  **Frontend** and **ML** start in parallel.

You can verify the blockchain deployment by checking the logs:

```bash
sudo docker logs voltix-deployer
```
