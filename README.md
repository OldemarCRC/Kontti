# Kontti - Terminal Container Management System  

Enterprise-level web application for managing container movements and inventories at container terminals and port facilities.  

## Features  
- User authentication and authorization  
- Container inventory management  
- Movement tracking (in/out)  
- Dispatch order processing  
- Customer management  
- Truck company registration  
- Real-time dashboard  
- Stack view visualization  
- Manifest registration  
- Location tracking within terminal  

## Tech Stack & Dependencies  

### Backend (API)  
- **Node.js** (v21.x)  
- **Express** (v4.18.2)  
- **MongoDB/Mongoose** (v8.8.3)  
- **JWT** (v9.0.2)  
- **Nodemailer** (v6.9.12)  
- **bcryptjs** (v2.4.3)  
- **CORS** (v2.8.5)  
- **Cookie Parser** (v1.4.7)  
- **Express Rate Limit** (v7.4.0)  
- **dotenv** (v16.4.5)  

### Frontend (Client)  
- **React** (v18.2.0)  
- **React Router DOM** (v6.22.3)  
  - `BrowserRouter`, `Routes`, `Route`  
  - `Link`, `useNavigate`, `useLocation`  
- **React Hooks**  
  - `useState`, `useEffect`, `useContext`, `useReducer`, `useCallback`  
- **React Toastify** (v10.0.4)  
- **Axios** (v1.6.7)  
- **PDF-lib** (v1.17.1)  
- **React Three Fiber** (v8.16.0)  
- **React Three Drei** (v9.102.6)  

## Prerequisites  
- **Node.js** >= 21.x  
- **MongoDB** connection string  
- **npm** or **yarn** package manager  

## Environment Setup  

### API (`.env`)  
```
MONGODB_URI=your_mongo_cluster_uri
NODE_ENV=development
JWT_SECRET=your_jwt_secret
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_google_app_password
BASE_URL=http://localhost:3000
Client
Development (.env.development):

REACT_APP_API_URL=http://localhost:8800
Production (.env.production):

REACT_APP_API_URL=https://kontti-api.onrender.com
Installation
1. Clone the repository

git clone https://github.com/OldemarCRC/Kontti.git
cd Kontti
2. Install API dependencies

cd api
npm install
3. Install Client dependencies

cd ../client
npm install
4. Set up environment variables as described above
Development Scripts
API

npm start         # Start with nodemon  
npm run start:prod # Start production server  
Client

npm start   # Start development server  
npm run build # Build for production  
npm test    # Run tests  
Deployment Process
1. Build the client application

cd client
npm run build
2. Commit and push changes

cd ..
git add .
git commit -m "your commit message"
git push origin main
The application will automatically deploy on Render based on the pushed changes.

Note: If you make frontend changes, make sure to build the client before committing:
cd client
npm run build
cd ..
git add .
git commit -m "your commit message"
git push origin main
The application will automatically deploy on Render based on the pushed changes.

Contact
For more details about this project, visit my portfolio: https://oldemarcrc.github.io/my-portfolio/

