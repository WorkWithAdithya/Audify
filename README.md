
# 🎵 Audify - Your Hub for Background Music

<div align="center">


**A modern microservices-based audio streaming platform built with React, Node.js, and cloud-native technologies**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white)](https://kubernetes.io/)

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## ✨ Features

### 🎧 For Users
- **Stream Music** - High-quality audio streaming with real-time playback
- **Smart Playlists** - Create and manage personalized playlists
- **Purchase Songs** - Buy individual tracks with secure payment processing
- **My Library** - Access your purchased songs anytime, anywhere
- **Album Browsing** - Explore curated albums and discover new music
- **Seamless Experience** - Smooth UI/UX with hot-reload development

### 👨‍💼 For Admins
- **Content Management** - Upload and manage songs, albums, and thumbnails
- **Dynamic Pricing** - Set custom prices or offer songs for free
- **Analytics Dashboard** - Track sales, revenue, and user engagement
- **Cloudinary Integration** - Efficient media storage and delivery
- **Real-time Updates** - Instant cache invalidation with Redis

### 🔐 Security & Payments
- **JWT Authentication** - Secure token-based authentication
- **Razorpay Integration** - Seamless payment processing for Indian market
- **Purchase Verification** - Robust payment signature validation
- **Encrypted Secrets** - Kubernetes secrets for sensitive data

---

## 🏗️ Architecture

### Microservices Design

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)              │
│                        Port: 5173                           │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴─────────┬─────────────┬──────────────┐
    │                  │             │              │
┌───▼─────────┐  ┌────▼──────┐  ┌──▼───────┐  ┌──▼────────┐
│User Service │  │Admin Svc  │  │Song Svc  │  │Payment Svc│
│  Port: 5000 │  │Port: 7000 │  │Port: 8000│  │Port: 9000 │
│  MongoDB    │  │PostgreSQL │  │PostgreSQL│  │PostgreSQL │
└─────────────┘  │Redis      │  │Redis     │  │Razorpay   │
                 │Cloudinary │  └──────────┘  └───────────┘
                 └───────────┘
```

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| **Backend** | Node.js, Express, TypeScript |
| **Databases** | MongoDB Atlas, PostgreSQL (Neon), Redis Cloud |
| **Storage** | Cloudinary (media files) |
| **Payments** | Razorpay |
| **Auth** | JWT, bcrypt |
| **Container** | Docker, Docker Compose |
| **Orchestration** | Kubernetes |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- kubectl (for Kubernetes deployment)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/WorkWithAdithya/Audify.git
cd Audify
```

### 2️⃣ Environment Setup
Create `.env` files in each service directory with required credentials:

**user-service/.env**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SEC=your_jwt_secret
```

**admin-service/.env**
```env
PORT=7000
DB_URL=your_postgresql_url
Cloud_Name=your_cloudinary_name
Cloud_Api_key=your_cloudinary_key
Cloud_Api_secret=your_cloudinary_secret
Redis_Password=your_redis_password
```

**song-service/.env**
```env
PORT=8000
DB_URL=your_postgresql_url
USER_SERVICE_URL=http://localhost:5000
Redis_Password=your_redis_password
```

**payment-service/.env**
```env
PORT=9000
DB_URL=your_postgresql_url
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
USER_SERVICE_URL=http://localhost:5000
SONG_SERVICE_URL=http://localhost:8000
```

### 3️⃣ Run with Docker Compose
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4️⃣ Access Application
- **Frontend**: http://localhost:5173
- **User API**: http://localhost:5000
- **Admin API**: http://localhost:7000
- **Song API**: http://localhost:8000
- **Payment API**: http://localhost:9000

---

## 🐳 Docker

### Build Individual Services
```bash
# User Service
cd user-service && docker build -t audiffy-user-service .

# Admin Service
cd admin-service && docker build -t audiffy-admin-service .

# Song Service
cd song-service && docker build -t audiffy-song-service .

# Payment Service
cd payment-service && docker build -t audiffy-payment-service .

# Frontend
cd frontend && docker build -t audiffy-frontend .
```

### Docker Compose Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild specific service
docker-compose up -d --build [service-name]

# Check status
docker-compose ps
```

---

## ☸️ Kubernetes Deployment

### Deploy to Kubernetes
```bash
# Apply all manifests
kubectl apply -f k8s-manifest.yaml

# Check deployment status
kubectl get pods -n audiffy
kubectl get svc -n audiffy

# View logs
kubectl logs -n audiffy -l app=user-service

# Scale deployment
kubectl scale deployment user-service -n audiffy --replicas=5
```

### Access Services
```bash
# Port forward to access locally
kubectl port-forward -n audiffy svc/frontend 8080:80

# Get LoadBalancer IP
kubectl get svc frontend -n audiffy
```

### Delete Deployment
```bash
kubectl delete -f k8s-manifest.yaml
```

---

## 📡 API Documentation

### User Service (Port 5000)
```
POST   /api/v1/user/register           # Register new user
POST   /api/v1/user/login              # User login
GET    /api/v1/user/me                 # Get user profile
POST   /api/v1/song/:id                # Add/remove from playlist
GET    /api/v1/user/purchases          # Get purchased songs
```

### Admin Service (Port 7000)
```
POST   /api/v1/album/new               # Create album (with thumbnail)
POST   /api/v1/song/new                # Upload song (with audio file)
POST   /api/v1/song/:id                # Add song thumbnail
PATCH  /api/v1/song/:id/price          # Update song price
DELETE /api/v1/album/:id               # Delete album
DELETE /api/v1/song/:id                # Delete song
```

### Song Service (Port 8000)
```
GET    /api/v1/album/all               # Get all albums
GET    /api/v1/song/all                # Get all songs
GET    /api/v1/album/:id               # Get album with songs
GET    /api/v1/song/:id                # Get single song
GET    /api/v1/song/:id/details        # Get song with purchase status (Auth)
GET    /api/v1/song/:id/stream         # Stream song (Auth, Purchase check)
GET    /api/v1/my/purchased            # Get user's purchased songs (Auth)
```

### Payment Service (Port 9000)
```
POST   /api/v1/payment/create-order           # Create single song order
POST   /api/v1/payment/verify                 # Verify single payment
POST   /api/v1/payment/create-bulk-order      # Create bulk order (cart)
POST   /api/v1/payment/verify-bulk            # Verify bulk payment
GET    /api/v1/payment/history                # Get purchase history
POST   /api/v1/payment/webhook                # Razorpay webhook
```

---

## 🗄️ Database Schema

### MongoDB (User Service)
```javascript
User {
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: 'user'),
  playlist: [String],           // Song IDs
  purchasedSongs: [String],     // Purchased song IDs
  timestamps: true
}
```

### PostgreSQL (Admin/Song/Payment Services)

**Albums Table**
```sql
albums {
  id: SERIAL PRIMARY KEY,
  title: VARCHAR(255),
  description: VARCHAR(255),
  thumbnail: VARCHAR(255),
  created_at: TIMESTAMP
}
```

**Songs Table**
```sql
songs {
  id: SERIAL PRIMARY KEY,
  title: VARCHAR(255),
  description: VARCHAR(255),
  thumbnail: VARCHAR(255),
  audio: VARCHAR(255),
  price: NUMERIC(10,2) DEFAULT 0.00,
  album_id: INTEGER (FK → albums),
  created_at: TIMESTAMP
}
```

**Purchases Table**
```sql
purchases {
  id: SERIAL PRIMARY KEY,
  user_id: VARCHAR(255),
  song_id: INTEGER,
  amount: NUMERIC(10,2),
  razorpay_order_id: VARCHAR(255) UNIQUE,
  razorpay_payment_id: VARCHAR(255),
  razorpay_signature: VARCHAR(255),
  status: VARCHAR(50) DEFAULT 'pending',
  created_at: TIMESTAMP
}
```

---

## 🔒 Security

- **JWT Authentication**: Secure token-based auth with 7-day expiry
- **Password Hashing**: bcrypt with salt rounds
- **Payment Verification**: HMAC SHA-256 signature validation
- **Kubernetes Secrets**: Encrypted storage of sensitive data
- **CORS Enabled**: Configured for cross-origin requests
- **Environment Variables**: Secrets never committed to repo

---

## 🎨 Frontend Features

- **Vite** for lightning-fast development
- **Tailwind CSS** for modern styling
- **React Router** for seamless navigation
- **React Context API** for state management
- **Hot Module Replacement** for instant updates
- **Responsive Design** for all screen sizes
- **Toast Notifications** for user feedback
- **Razorpay Checkout** integration

---

## 📊 Performance

- **Redis Caching**: 30-minute TTL for albums and songs
- **PostgreSQL Indexing**: Optimized queries on user_id and song_id
- **CDN Integration**: Cloudinary for fast media delivery
- **Docker Multi-stage Builds**: Optimized image sizes
- **Kubernetes Auto-scaling**: Based on CPU/memory usage
- **Resource Limits**: Defined for all containers

---

## 🛠️ Development

### Run Locally (Without Docker)
```bash
# User Service
cd user-service
npm install
npm run dev

# Admin Service
cd admin-service
npm install
npm run dev

# Song Service
cd song-service
npm install
npm run dev

# Payment Service
cd payment-service
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Build TypeScript
```bash
npm run build
```

### Run Production Build
```bash
npm start
```

---

## 📈 Monitoring

### View Service Logs
```bash
# Docker
docker-compose logs -f [service-name]

# Kubernetes
kubectl logs -n audiffy -l app=[service-name] -f
```

### Check Resource Usage
```bash
# Docker
docker stats

# Kubernetes
kubectl top pods -n audiffy
kubectl top nodes
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

---

## 👨‍💻 Author

**Adithya**

- GitHub: [@WorkWithAdithya](https://github.com/WorkWithAdithya)
- Project Link: [https://github.com/WorkWithAdithya/Audify](https://github.com/WorkWithAdithya/Audify)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)
- [MongoDB](https://www.mongodb.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Cloudinary](https://cloudinary.com/)
- [Razorpay](https://razorpay.com/)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

</div>
