# Visitor Management System

A comprehensive visitor management system with QR code check-in, OTP verification, safety training assessments, and gate dashboard.

## Features

- **Visitor Registration**: Online form for visitors to register their visit
- **QR Code Generation**: Automatic QR code generation for each visit
- **OTP Verification**: One-time password for secure check-in
- **Safety Training**: Assessment module for visitor safety training
- **Gate Dashboard**: Real-time tracking of visitor check-in/check-out
- **Admin Panel**: Manage visits, generate reports, and analytics
- **Email Notifications**: Automated email confirmations

## Project Structure

```
visitor-management-system/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── adminController.js # Admin operations
│   │   ├── gateController.js  # Gate operations
│   │   ├── trainingController.js # Training module
│   │   └── visitorController.js  # Visitor operations
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── validation.js      # Input validation
│   ├── models/
│   │   ├── Admin.js           # Admin model
│   │   ├── Assessment.js      # Assessment model
│   │   ├── OTP.js             # OTP model
│   │   └── Visit.js           # Visit model
│   ├── routes/
│   │   ├── adminRoutes.js     # Admin routes
│   │   ├── gateRoutes.js      # Gate routes
│   │   └── visitorRoutes.js   # Visitor routes
│   ├── utils/
│   │   ├── mailService.js     # Email service
│   │   ├── otpService.js      # OTP utilities
│   │   └── qrGenerator.js     # QR code generator
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Express server
│
├── frontend/
│   ├── index.html             # Main HTML file
│   ├── styles.css             # CSS styles
│   └── app.js                 # Frontend JavaScript
│
└── README.md                  # This file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (if available)
   - Or edit `.env` file with your settings:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/visitor-management
     JWT_SECRET=your-secret-key
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     ```

4. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

5. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

The frontend is a static HTML/JS application. You can:

1. **Using a simple HTTP server**:
   ```bash
   # If you have Python installed
   cd frontend
   python -m http.server 3000
   ```

2. **Using VS Code Live Server**:
   - Open `frontend/index.html` in VS Code
   - Right-click and select "Open with Live Server"

3. **Directly in browser**:
   - Simply open `frontend/index.html` in your browser

## API Endpoints

### Visitor Routes
- `POST /api/visitors/register` - Register a new visitor
- `GET /api/visitors/qr/:qrCode` - Get visitor by QR code
- `POST /api/visitors/verify-otp` - Verify OTP for check-in
- `POST /api/visitors/assessment` - Submit safety assessment
- `GET /api/visitors/status/:visitId` - Get visitor status
- `DELETE /api/visitors/cancel/:visitId` - Cancel visit

### Gate Routes
- `POST /api/gate/check-in` - Check in visitor
- `POST /api/gate/check-out` - Check out visitor
- `GET /api/gate/active-visits` - Get all active visits
- `GET /api/gate/history` - Get visit history
- `GET /api/gate/search` - Search visitor

### Admin Routes
- `POST /api/admin/register` - Register admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/visits` - Get all visits
- `PUT /api/admin/visits/:id/approve` - Approve visit
- `PUT /api/admin/visits/:id/reject` - Reject visit
- `GET /api/admin/reports/daily` - Daily report
- `GET /api/admin/reports/weekly` - Weekly report
- `GET /api/admin/reports/monthly` - Monthly report

## Usage

1. **Register a Visit**: Fill out the visitor registration form
2. **Complete Training**: Take the safety assessment (70% to pass)
3. **Get QR Code**: Receive QR code via email or view in QR page
4. **Check-in**: Present QR code/OTP at security gate
5. **Check-out**: Complete check-out at security gate when leaving

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: JWT (JSON Web Tokens)
- **QR Generation**: qrcode library
- **Email**: Nodemailer

## License

MIT License

