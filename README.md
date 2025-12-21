# AutoGlow - Car Painting & Modification Service Project

Welcome to **AutoGlow**, a premium full-stack web application designed for a professional car painting, denting, and modification business. This project demonstrates a modern, responsive, and feature-rich platform that allows users to explore services, book appointments, and manage their profiles, while providing administrators with powerful tools to manage the business.

## 🚀 Project Overview

**AutoGlow** is built to bridge the gap between car service providers and customers. It features a sleek, high-end user interface (UI) and a robust backend system.

*   **Project Name**: AutoGlow
*   **Type**: Full-Stack Web Application (MERN Stack)
*   **Target Audience**: Car owners seeking premium automotive services.

## 🛠️ Technology Stack

We utilized a modern tech stack to ensure performance, scalability, and a great developer experience.

### **Frontend (Client-Side)**
*   **Framework**: [React.js](https://react.dev/) (v19) - Component-based UI library.
*   **Build Tool**: [Vite](https://vitejs.dev/) - Lightning-fast build tool and development server.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4) - Utility-first CSS framework for rapid, responsive design.
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) - For smooth, complex animations and transitions.
*   **Routing**: [React Router DOM](https://reactrouter.com/) (v7) - Client-side routing.
*   **HTTP Client**: [Axios](https://axios-http.com/) - For making API requests to the backend.
*   **Icons**: [Lucide React](https://lucide.dev/) - Beautiful, consistent icons.
*   **Notifications**: [React Hot Toast](https://react-hot-toast.com/) - Elegant toast notifications.
*   **Charts**: [Recharts](https://recharts.org/) - For data visualization in the Admin Dashboard.

### **Backend (Server-Side)**
*   **Runtime**: [Node.js](https://nodejs.org/) - JavaScript runtime environment.
*   **Framework**: [Express.js](https://expressjs.com/) - Fast, unopinionated web framework for Node.js.
*   **Database**: [MongoDB](https://www.mongodb.com/) - NoSQL database for flexible data storage.
*   **ODM**: [Mongoose](https://mongoosejs.com/) - Object Data Modeling library for MongoDB.
*   **Authentication**:
    *   **JWT (JSON Web Tokens)**: For secure, stateless user authentication.
    *   **Bcryptjs**: For hashing and securing user passwords.
*   **File Uploads**: [Multer](https://github.com/expressjs/multer) - Middleware for handling `multipart/form-data`.
*   **Email**: [Nodemailer](https://nodemailer.com/) - For sending contact form inquiries to the admin.
*   **Environment**: [Dotenv](https://github.com/motdotla/dotenv) - For managing environment variables.
*   **CORS**: Middleware to enable Cross-Origin Resource Sharing.

---

## ✨ Key Features

### **For Users**
1.  **Immersive "Wow" Design**: A premium aesthetic with smooth animations, glassmorphism effects, and responsive layouts.
2.  **Service Exploration**: Detailed descriptions of services like Painting, Denting, Wraps, and Modifications.
3.  **Online Booking System**: Easy-to-use form to book appointments for specific dates and car models.
4.  **Dynamic Pricing**: Viewing estimated costs based on car types (Sedan, SUV, Luxury, etc.).
5.  **User Dashboard**:
    *   View "My Bookings" and track their status (Pending, In Progress, Completed).
    *   Manage Profile (Update details, Change Password, Upload Avatar).
6.  **Authentication**: Secure Sign Up and Login functionality.

### **For Admins**
1.  **Secure Admin Portal**: Restricted access for verified administrators.
2.  **Dashboard Overview**: Visual charts displaying booking stats and business metrics.
3.  **Booking Management**: View all customer bookings and update their status (e.g., mark as Completed).
4.  **Customer Management**: View a list of registered users.
5.  **Messages**: View inquiries sent via the Contact Us form.
6.  **Gallery Management**: Upload and manage before/after images for the portfolio.

---

## 📂 Project Structure

```bash
ReactCa2/
├── Node/
│   ├── backend/             # Server-side code
│   │   ├── models/          # Mongoose database models (User, Booking, etc.)
│   │   ├── routes/          # API route definitions
│   │   ├── uploads/         # Directory for uploaded images
│   │   ├── server.js        # Entry point for the backend
│   │   ├── .env             # Environment variables (Sensitive)
│   │   └── package.json     # Backend dependencies
│   │
│   ├── frontend/            # Client-side code
│   │   ├── public/          # Static assets (favicons, etc.)
│   │   ├── src/
│   │   │   ├── assets/      # Images and static files
│   │   │   ├── components/  # Reusable React components (Navbar, Footer, etc.)
│   │   │   ├── pages/       # Main pages (Home, Login, Dashboard, etc.)
│   │   │   ├── App.jsx      # Main application component
│   │   │   ├── main.jsx     # React entry point
│   │   │   └── index.css    # Global styles & Tailwind directives
│   │   ├── package.json     # Frontend dependencies
│   │   └── vite.config.js   # Vite configuration
│   └── README.md            # This file
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### **Prerequisites**
*   **Node.js**: Installed on your machine.
*   **MongoDB**: An active MongoDB local instance or MongoDB Atlas URI.

### **1. Setup the Backend**

Open a terminal and navigate to the `backend` folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

**Configuration**:
Ensure you have a `.env` file in the `backend` root with the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

Start the Backend Server:

```bash
# Optional: Seed initial data (prices/services)
node seed.js

# Start the server
node server.js
# OR
npm start
```
*The server will run on `http://localhost:5000`*

### **2. Setup the Frontend**

Open a new terminal and navigate to the `frontend` folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Development Server:

```bash
npm run dev
```
*The application will open at `http://localhost:5173`*

---

## 👥 Usage Guide

1.  **Open the App**: Go to `http://localhost:5173`.
2.  **Register**: Create a new account.
3.  **Explore**: Navigate through Home, Services, and About pages.
4.  **Book**: Go to "Book Now", select your car details and service.
5.  **Admin Access**:
    *   *Note*: To make a user an Admin, you currently need to manually update the `role` field to `admin` in your MongoDB database for that specific user document.
    *   Once Admin, log in to access the Admin Dashboard.

---

## 📄 License

This project is open-source and available for educational and personal use.

---

*Made with ❤️ by the AutoGlow Team*
