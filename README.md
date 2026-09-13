# ♻️ SmartWaste — Next-Gen AI Municipal Waste Management System

SmartWaste is an enterprise-grade full-stack MERN (MongoDB, Express, React, Node.js) web application designed for smart urban sanitation management. It features computer vision AI waste classification, real-time status tracking via Socket.IO, role-based workflows for Citizens, Sanitation Workers, Municipal Authorities, and Admins, interactive mapping, and rich command center analytics built with Recharts.

---

## 🛠️ Final Technology Stack

- **Frontend**: React.js 18, Tailwind CSS, React Router v6, Axios, Socket.IO Client, Recharts, Leaflet / OpenStreetMap.
- **Backend**: Node.js, Express.js, Socket.IO, JWT (JSON Web Tokens), bcryptjs, Multer, Cloudinary.
- **Database**: MongoDB & Mongoose ODM.
- **AI Integration**: AI Vision Service Gateway (External AI Vision API / Integrated Computer Vision Classifier).

---

## 🔐 Key Features & Role Access

1. **Citizen Portal (`/citizen`)**:
   - Report waste incidents with photo uploads.
   - Run live AI Vision classification (auto-detects Category, Severity, and Disposal Directive).
   - Pin location using Browser GPS or interactive map picker.
   - Track live complaint status timeline (Pending -> Assigned -> In Progress -> Resolved).
   - View before & after cleanup verification proof photos.

2. **Sanitation Worker App (`/worker`)**:
   - View assigned work orders.
   - Interactive dispatch route map.
   - Update job status (`In Progress`, `Resolved`, `Rejected`).
   - Upload completed site cleanup proof photo (`afterImage`).

3. **Authority Command Center (`/authority`)**:
   - Recharts dynamic dashboard analytics (Resolution time SLA, Waste category breakdown, Weekly trend, Cleanliness Index).
   - Waste hotspots map visualization.
   - Dispatch workers to pending complaints with 1-click real-time Socket.IO notifications.

4. **Admin Console (`/admin`)**:
   - User account registry.
   - Dynamic Role Based Access Control (RBAC) & zone assignments.

---

## 🚀 Quick Start Guide

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Seed Mock Database Data
```bash
cd server
npm run seed
```

### 3. Start Backend Server
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

### 4. Install & Start Frontend Client
```bash
cd client
npm install
npm run dev
# Client running on http://localhost:5173
```

---

## 🔑 Demo Test Credentials

| Role | Email | Password |
|---|---|---|
| **Citizen** | `citizen@smartwaste.org` | `password123` |
| **Worker** | `worker@smartwaste.org` | `password123` |
| **Authority** | `authority@smartwaste.org` | `password123` |
| **Admin** | `admin@smartwaste.org` | `password123` |

---

## 📡 Socket.IO Real-Time Channels

- `role:Authority` room -> Receives instant `complaint:created` notifications.
- `user:<workerId>` room -> Receives `task:assigned` dispatch notifications.
- `user:<citizenId>` room -> Receives `complaint:resolved` completion notifications with before/after photos.
