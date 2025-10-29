# KONTTI - Container Terminal Management System

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

## Tech Stack

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
- **Vite** (v7.1.12) - Fast build tool and dev server
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

- Node.js >= 21.x
- MongoDB connection string
- npm or yarn package manager

## Environment Setup

### API
Create a `.env` file in the `api/` directory:

```env
MONGODB_URI=your_mongo_cluster_uri
NODE_ENV=development
JWT_SECRET=your_jwt_secret
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_google_app_password
BASE_URL=http://localhost:3000
```

### Client
Create environment files in the `client/` directory:

**Development (`.env.development`):**
```env
VITE_API_URL=http://localhost:8800
```

**Production (`.env.production`):**
```env
VITE_API_URL=https://kontti-api.onrender.com
```

> **Note:** Vite uses `VITE_` prefix for environment variables, accessed via `import.meta.env.VITE_*` instead of `process.env.*`

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/OldemarCRC/Kontti.git
cd Kontti
```

### 2. Checkout the Vite branch
```bash
git checkout feature/vite-ui-overhaul-20251029
```

### 3. Install dependencies
From the project root (installs both API and Client dependencies):
```bash
npm install
```

Or install individually:
```bash
# Install API dependencies
cd api
npm install

# Install Client dependencies
cd ../client
npm install
```

### 4. Set up environment variables
Configure `.env` files as described in the Environment Setup section above.

## Development Scripts

### Run Both API and Client Concurrently (Recommended)
From the project root:
```bash
npm run dev
```
This starts:
- API server on `http://localhost:8800`
- Client dev server on `http://localhost:3000`

### Run Individually

**API only:**
```bash
npm run dev:api
# or
cd api
npm run dev
```

**Client only:**
```bash
npm run dev:client
# or
cd client
npm run dev
```

### Available Scripts

#### Root `package.json`
- `npm run dev` - Run API and Client concurrently with colored logs
- `npm run dev:api` - Run API server only
- `npm run dev:client` - Run Client dev server only
- `npm run version:bump` - Bump patch version
- `npm run version:minor` - Bump minor version

#### API (`api/package.json`)
- `npm run dev` - Start API with nodemon (auto-reload on changes)
- `npm start` - Start API production server

#### Client (`client/package.json`)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Structure

```
Kontti/
├── api/                          # Backend server
│   ├── config/                   # Configuration files
│   ├── middlewares/              # Express middlewares
│   ├── modules/                  # Feature modules
│   │   ├── auth/                 # Authentication
│   │   ├── customers/            # Customer management
│   │   ├── dispatch/             # Dispatch orders
│   │   ├── inventory/            # Container inventory
│   │   ├── manifest/             # Manifest management
│   │   ├── movement/             # Movement tracking
│   │   ├── truck_companies/      # Truck company management
│   │   └── users/                # User management
│   ├── routes/                   # API routes
│   └── services/                 # Business logic services
│
├── client/                       # Frontend application (Vite + React)
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── assets/               # Images and media
│   │   ├── components/           # Reusable components
│   │   │   ├── dashboard/        # Dashboard widgets
│   │   │   ├── footer/           # Footer component
│   │   │   ├── header/           # Header component
│   │   │   ├── logos/            # Logo components
│   │   │   ├── navbar/           # Navigation bar
│   │   │   └── user_menu/        # User menu
│   │   ├── context/              # React Context providers
│   │   ├── pages/                # Page components
│   │   │   ├── login/            # Login page
│   │   │   ├── dashboard_page/   # Dashboard
│   │   │   ├── dispatch/         # Container dispatch
│   │   │   ├── in_movements/     # Inbound movements
│   │   │   ├── out_movements/    # Outbound movements
│   │   │   ├── inventory/        # Inventory management
│   │   │   └── ...               # Other pages
│   │   └── services/             # API service functions
│   └── vite.config.js            # Vite configuration
│
└── package.json                  # Root workspace configuration
```

## Deployment Process

### 1. Build the client application
```bash
cd client
npm run build
```

### 2. Commit and push changes
```bash
git add .
git commit -m "your commit message"
git push origin feature/vite-ui-overhaul-20251029
```

The application will automatically deploy on Render based on the pushed changes.

> **Note:** Always build the client before committing frontend changes to ensure the production build is up to date.

## Migration Notes (Create React App → Vite)

This branch includes a complete migration from Create React App to Vite. Key changes:

### Environment Variables
- **Old:** `process.env.REACT_APP_*`
- **New:** `import.meta.env.VITE_*`

### Scripts
- **Old:** `npm start` (CRA)
- **New:** `npm run dev` (Vite)

### Benefits of Vite
- ⚡ Faster cold starts
- 🔥 Instant Hot Module Replacement (HMR)
- 📦 Optimized production builds with Rollup
- 🎯 Native ES modules in development

## Port Configuration

- **API Server:** `http://localhost:8800`
- **Client Dev Server:** `http://localhost:3000`
- **MongoDB:** Default connection via MONGODB_URI

## Troubleshooting

### "process is not defined" error
This occurs when old CRA environment variable syntax is used. Ensure all references use:
```javascript
// ❌ Wrong (Create React App)
process.env.REACT_APP_API_URL

// ✅ Correct (Vite)
import.meta.env.VITE_API_URL
```

### Port already in use
If ports 3000 or 8800 are in use:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### MongoDB connection issues
- Verify `MONGODB_URI` in `api/.env`
- Ensure MongoDB cluster allows connections from your IP
- Check network connectivity

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Proprietary License.

## Contact

For more details about this project, visit my portfolio: [https://oldemarcrc.github.io/my-portfolio/](https://oldemarcrc.github.io/my-portfolio/)

---

**Version:** 2.0.0  
**Last Updated:** October 2025  
**Branch:** feature/vite-ui-overhaul-20251029

