Kontti - Terminal Container Management System
Enterprise-level web application for managing container movements and inventories at container terminals and port facilities.
Features

User authentication and authorization
Container inventory management
Movement tracking (in/out)
Dispatch order processing
Customer management
Truck company registration
Real-time dashboard
Stack view visualization
Manifest registration
Location tracking within terminal

Features

User authentication and authorization
Container inventory management
Movement tracking (in/out)
Dispatch order processing
Customer management
Truck company registration
Real-time dashboard
Stack view visualization
Manifest registration
Location tracking within terminal

Tech Stack & Dependencies
Backend (API)

Node.js (v21.x)
Express (v4.18.2)
MongoDB/Mongoose (v8.8.3)
JWT (v9.0.2)
Nodemailer (v6.9.12)
bcryptjs (v2.4.3)
CORS (v2.8.5)
Cookie Parser (v1.4.7)
Express Rate Limit (v7.4.0)
dotenv (v16.4.5)

Frontend (Client)

React (v18.2.0)
React Router DOM (v6.22.3)

BrowserRouter, Routes, Route
Link, useNavigate, useLocation


React Hooks

useState, useEffect, useContext, useReducer, useCallback


React Toastify (v10.0.4)
Axios (v1.6.7)
PDF-lib (v1.17.1)
React Three Fiber (v8.16.0)
React Three Drei (v9.102.6)

Prerequisites

Node.js >= 21.x
MongoDB connection string
npm or yarn package manager

Environment Setup
API (.env)
CopyMONGODB_URI=your_mongo_cluster_uri
NODE_ENV=development
JWT_SECRET=your_jwt_secret
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_google_app_password
BASE_URL=http://localhost:3000
Client
Development (.env.development):
CopyREACT_APP_API_URL=http://localhost:8800
Production (.env.production):
CopyREACT_APP_API_URL=https://kontti-api.onrender.com
Installation

Clone the repository
Install API dependencies:

bashCopycd api
npm install

Install Client dependencies:

bashCopycd client
npm install

Set up environment variables as described above

Development Scripts
API
bashCopynpm start         # Start with nodemon
npm run start:prod # Start production server
Client
bashCopynpm start   # Start development server
npm run build # Build for production
npm test    # Run tests
Deployment Process

Build the client application:

bashCopycd client
npm run build

Commit and push changes:

bashCopycd ..
git add .
git commit -m "your commit message"
git push origin main

The application will automatically deploy on Render based on the pushed changes.

Contact
For more information about this project, visit my portfolio: https://oldemarcrc.github.io/my-portfolio/
License
All rights reserved. This software is proprietary and confidential.
