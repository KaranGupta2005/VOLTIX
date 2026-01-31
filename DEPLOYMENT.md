# 🚀 AWS Deployment Roadmap for VOLTIX

This guide lays out the steps to deploy your full-stack application (Next.js + Node.js + Redis + MongoDB) to AWS EC2 using Docker.

## 📋 Prerequisites

- An AWS Account
- A domain name (optional but recommended for SSL)
- SSH access to your terminal

---

## 🏗️ Phase 1: Prepare Your Code (Local)

We have already created `Dockerfile` for both frontend and backend. Now create a `docker-compose.prod.yml` in the root of your project:

```yaml
version: "3.8"

services:
  # Frontend (Next.js)
  frontend:
    build: ./my-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
    depends_on:
      - backend

  # Backend (Node.js)
  backend:
    build: ./backend
    restart: always
    ports:
      - "5001:5001"
    environment:
      - PORT=5001
      - MONGO_URL=${MONGO_URL} # We will set this on the server
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - CLIENT_URL=https://yourdomain.com
      # Add other env vars here
    depends_on:
      - redis

  # Redis
  redis:
    image: redis:alpine
    restart: always
    ports:
      - "6379:6379"

  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - frontend
      - backend
```

---

## ☁️ Phase 2: Launch AWS EC2 Instance

1.  **Login to AWS Console** → Go to **EC2**.
2.  **Launch Instance**:
    - **Name**: `Voltix-Server`
    - **OS**: Ubuntu Server 22.04 LTS
    - **Instance Type**: `t3.small` (Recommended min for Node+Next) or `t2.micro` (Free tier, might struggle with build).
    - **Key Pair**: Create new (download `.pem` file).
3.  **Security Group** (Firewall):
    - Allow SSH (Port 22) from Anywhere (or My IP).
    - Allow HTTP (Port 80) from Anywhere.
    - Allow HTTPS (Port 443) from Anywhere.
4.  **Launch**!

---

## 🔧 Phase 3: Server Setup

1.  **SSH into your server**:

    ```bash
    chmod 400 your-key.pem
    ssh -i "your-key.pem" ubuntu@<YOUR_EC2_IP>
    ```

2.  **Install Docker & Git**:

    ```bash
    # Update system
    sudo apt update && sudo apt upgrade -y

    # Install Docker
    sudo apt install docker.io docker-compose -y

    # Enable Docker to run without sudo
    sudo usermod -aG docker $USER
    # (Log out and log back in for this to take effect)
    exit
    ssh -i "your-key.pem" ubuntu@<YOUR_EC2_IP>
    ```

3.  **Details Setup**:
    ```bash
    # Clone your repo
    git clone https://github.com/KaranGupta2005/VOLTIX.git
    cd VOLTIX
    ```

---

## 🚀 Phase 4: Deploy

1.  **Create Production Env File**:

    ```bash
    nano .env
    ```

    Paste your backend `.env` content here. Make sure to use the **Atlas MongoDB URL** (cloud), not localhost.

2.  **Run with Docker Compose**:
    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```

---

## 🔒 Phase 5: Domain & SSL (HTTPS)

1.  **Point Domain**: Go to GoDaddy/Namecheap and point `A Record` to your EC2 IP.
2.  **Nginx Config**: You will need to configure Nginx to route traffic:
    - `yourdomain.com` → `frontend:3000`
    - `api.yourdomain.com` → `backend:5001`
3.  **Certbot**: Run Certbot to get free SSL certificates.

---

## Alternative: The "Easy Way" (Vercel + Render)

If EC2 feels too manual, do this:

1.  **Frontend**: Deploy `my-app` folder to **Vercel** (connect GitHub, done in 2 mins).
2.  **Backend**: Deploy `backend` folder to **Render.com** or **Railway.app** (connect GitHub, add Env Vars).
3.  **Database**: Continue using MongoDB Atlas.

This setup costs $0/mo (Free tiers) and requires zero server maintenance.
