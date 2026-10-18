# StreamSphere 🎬

A modern, full-stack video streaming and content sharing platform built on the **MERN** stack (MongoDB, Express.js, React.js, Node.js) with JWT authentication and HTTP 206 Partial Content byte-range video streaming.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)
![Node](https://img.shields.io/badge/Node.js-22.x-green.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)

> **Live Production Demo**: [https://streamsphere-lemon.vercel.app](https://streamsphere-lemon.vercel.app)

![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)
![Express](https://img.shields.io/badge/Express.js-4.x-black.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg)

---

## 🌟 Key Highlights

- **HTTP 206 Partial Content Video Streaming**: High-throughput video delivery engine using HTTP `Range` request headers for smooth seek, instant start, and minimal memory overhead.
- **Full Authentication & Authorization**: Secure session handling using JSON Web Tokens (JWT) and `bcryptjs` password hashing.
- **Responsive YouTube-Grade UI**: Built with React, Vite, Tailwind CSS, and Lucide Icons featuring a dark mode aesthetic, responsive sidebar, category filters, and modal uploaders.
- **Interactive Engagement**: Live comment threads, view counters, like/dislike interactions, and channel subscription states.
- **Scalable RESTful Architecture**: Modular Express router structure with centralized error handling and Mongoose schema validation.

---

## 🏗️ Architecture

```
                                  +-----------------------+
                                  |   React + Vite SPA    |
                                  |   (Tailwind Client)   |
                                  +-----------+-----------+
                                              |
                              HTTPS (REST / Range Requests)
                                              |
                                  +-----------v-----------+
                                  |   Express.js Server   |
                                  |   (Node.js Runtime)   |
                                  +-----+-----------+-----+
                                        |           |
                        +---------------+           +---------------+
                        |                                           |
             +----------v----------+                     +----------v----------+
             |  MongoDB / Mongoose |                     | Disk Storage / CDN  |
             |  (Users & Metadata) |                     |  (Chunked Videos)   |
             +---------------------+                     +---------------------+
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas connection string)

### 1. Clone the repository
```bash
git clone https://github.com/Krishlayy/StreamSphere.git
cd StreamSphere
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your PORT and MONGODB_URI in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |

### Video Management & Streaming (`/api/videos`)
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `GET` | `/api/videos` | List all videos with search & category filters | No |
| `GET` | `/api/videos/stream/:id` | **Stream video with HTTP 206 Byte-Range headers** | No |
| `GET` | `/api/videos/:id` | Retrieve video details and increment view count | No |
| `POST` | `/api/videos/upload` | Upload new video with thumbnail and metadata | Yes |
| `POST` | `/api/videos/:id/like` | Like or unlike a video | Yes |
| `POST` | `/api/videos/:id/comments` | Post a comment on a video | Yes |

---

## 🧪 Testing

Run backend streaming and API validation tests:
```bash
cd backend
npm test
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
