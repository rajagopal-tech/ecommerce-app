# Modern Ecommerce App 🚀

A professional, secure, and scalable e-commerce application built with the MERN stack.

## ✨ Key Features

- **Professional Architecture**: Centralized API service with Axios interceptors for seamless token management and error handling.
- **Robust Security**: 
  - Environment-based configuration (JWT secrets, DB URIs).
  - Standardized JSON API responses for all endpoints.
  - Role-based Access Control (RBAC) with `Admin` and `User` roles.
  - Ownership verification for orders.
- **Administrative Control**: Dedicated Admin Dashboard for real-time inventory management.
- **Premium UI/UX**: 
  - Unified design system using CSS variables.
  - Skeleton loaders for improved perceived performance.
  - Fully responsive, modern aesthetics with a focus on usability.
- **Scalability**: Backend pagination for product listings and standardized data fetching.

## 🛠 Tech Stack

- **Frontend**: React, React Router, Axios, CSS3 (Vanilla)
- **Backend**: Node.js, Express, MongoDB, JWT
- **DevOps**: Dotenv (Environment Management)

## 🚀 Getting Started

### 1. Prerequisites
- Node.js & npm installed.
- MongoDB Atlas account or local MongoDB instance.

### 2. Environment Variables
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### 3. Installation & Run

#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 🔐 Admin Access
To grant a user admin privileges, manually update the `role` field in the MongoDB `users` collection to `"admin"`. Once logged in as an admin, a new **Admin** link will appear in the navigation bar.

---

*This project was modernized to follow industry best practices for security and scalability.*
