# AutoGlow Backend API

The backend server for the **AutoGlow** car painting and modification platform. Built with Node.js, Express, and MongoDB, it provides a robust RESTful API for user authentication, booking management, service pricing, and administrative controls.

## 🛠️ Tech Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (via Mongoose)
*   **Authentication**: JSON Web Tokens (JWT)
*   **Security**: Bcryptjs (Password Hashing)
*   **File Handling**: Multer (Image Uploads)
*   **Email**: Nodemailer (Contact Form Inquiries)
*   **CORS**: Cross-Origin Resource Sharing enabled

## 📂 Directory Structure

```bash
backend/
├── config/              # Configuration files (if any)
├── middleware/
│   └── auth.js          # JWT verification middleware
├── models/              # Mongoose Database Schemas
│   ├── Booking.js       # Booking details and status
│   ├── Contact.js       # Contact form submissions
│   ├── Gallery.js       # Gallery image metadata
│   ├── ServicePrice.js  # Base prices for services
│   └── User.js          # User profiles and roles (Admin/User)
├── routes/              # API Route Definitions
│   ├── api.js           # General API (Bookings, Services, Contact)
│   ├── auth.js          # Authentication & User Management
│   └── gallery.js       # Gallery Image Management
├── uploads/             # Directory for storing uploaded images
├── .env                 # Environment variables (Sensitive)
├── server.js            # Application Entry Point
└── package.json         # Dependencies and Scripts
```

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** and **MongoDB** installed.

### 2. Installation
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

### 3. Configuration (.env)
Create a `.env` file in the root of the `backend` folder with the following keys:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/car-painting-db
JWT_SECRET=your_super_secret_key
# For sending emails (Optional but recommended for Contact form)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

### 4. Database Seeding
To populate the database with initial service prices:
```bash
npm run seed:prices
```

This inserts or updates the Dent Removal, Full Paint, and Stickering packages
for Hatchback, Sedan, SUV, and Luxury vehicles. It uses `MONGO_URI` from
`backend/.env` and does not delete existing service prices.

### 5. Running the Server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```
The server will start on `http://localhost:5000`.

## 📡 API Endpoints

### **Authentication (`/api/auth`)**

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login user & get JWT | ❌ |
| `GET` | `/me` | Get current user details | ✅ |
| `GET` | `/users` | Get all users (Admin) | ⚠️ (Admin Check) |
| `POST` | `/upload-avatar` | Upload user profile picture | ✅ |
| `PUT` | `/profile` | Update user profile details | ✅ |
| `PUT` | `/change-password` | Change user password | ✅ |

### **Bookings & Services (`/api`)**

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/bookings` | Create a new service booking | ✅ |
| `GET` | `/my-bookings` | Get logged-in user's bookings | ✅ |
| `GET` | `/all-bookings` | Get all bookings (Admin) | ❌ (Internal) |
| `PUT` | `/bookings/:id` | Update booking status (Admin) | ❌ (Internal) |
| `POST` | `/bookings/:id/feedback` | Add feedback to completed order | ✅ |
| `POST` | `/bookings/:id/request-cancel-otp` | Request OTP to cancel order | ✅ |
| `PUT` | `/bookings/:id/cancel` | Cancel order using OTP | ✅ |
| `GET` | `/prices` | Get service prices (filter by `carType`) | ❌ |
| `POST` | `/prices` | Add/Update service price (Admin) | ❌ (Internal) |
| `POST` | `/contact` | Submit contact form inquiry | ❌ |
| `GET` | `/contacts` | Get all contact messages | ❌ (Internal) |

### **Gallery (`/api/gallery`)**

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all gallery images | ❌ |
| `POST` | `/` | Upload a new image (Admin) | ✅ |

## 🛡️ Security & Middleware

*   **Auth Middleware**: `middleware/auth.js` verifies the `x-auth-token` header using JWT. If valid, the user ID is added to `req.user`.
*   **Passwords**: User passwords are automatically hashed using `bcryptjs` before saving to the database (via mongoose pre-save hook).

## 📷 File Uploads

*   Images (Avatars & Gallery) are stored locally in the `uploads/` directory.
*   The `uploads/` folder is served statically via Express, accessible at `http://localhost:5000/uploads/filename.jpg`.
