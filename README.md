# Smart Virtual Learning Ecosystem

A comprehensive full-stack Smart Virtual Learning Ecosystem built with the MERN stack (MongoDB, Express.js, React.js, Node.js). 
This project implements Role-Based Access Control (Admin, Faculty, Student) across 8 core operational modules.

## Features & Modules

1. **Authentication** - JWT-based login/register with Role-Based Access Control.
2. **User Management** - Admin controls for all users.
3. **Course Management** - Faculty can create courses, Students can enroll.
4. **Learning Content** - Faculty uploads materials (videos, documents, links).
5. **Assessments** - Faculty creates assignments; students submit them on the platform.
6. **Progress Tracking** - Automatic tracking of completed content and assessments.
7. **Reporting** - Admins and Faculty can generate system and course reports.
8. **Notifications** - Real-time alerts for users on important events.
9. **Dashboard** - Role-specific statistics using Recharts.

## Technologies Used

- **Frontend:** React.js, React Router v6, Axios, Recharts, Tailwind CSS, Vite.
- **Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs, cors.
- **Database:** MongoDB.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Database (Local or MongoDB Atlas)

### Local Setup Instructions

#### 1. Clone or Download the Repository
Navigate to the root directory `smart-virtual-learning`.

#### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Variables:
   - Rename `.env.example` to `.env`
   - Update `MONGO_URI` to your local MongoDB instance or Atlas URI.
4. Start the server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

#### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at the URL provided by Vite (usually `http://localhost:3000` or `http://localhost:5173`).

### Default Roles for Testing
When you register a new user, you can choose `Student`, `Faculty`, or `Admin` from the dropdown for testing purposes.

## Folder Structure
```text
smart-virtual-learning/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/ 
│   │   ├── pages/      
│   │   ├── context/    
│   │   ├── services/   
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```
