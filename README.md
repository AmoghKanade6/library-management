# 📚 Library Management System

A full-stack library management application with Auth0 authentication, Express REST API backend, and React TypeScript frontend. Features real-time book borrowing, user management, admin dashboard, and responsive glass morphism UI.

---

## 📁 Folder Structure

```
lib-management/
│
├── client/                          # React Frontend Application
│   ├── public/                      # Static assets
│   │   ├── index.html              # HTML template
│   │   └── favicon.ico             # App icon
│   │
│   ├── src/
│   │   ├── components/             # React Components
│   │   │   ├── BookList.tsx        # Book grid with tabs (All Books / My Borrowed Books)
│   │   │   ├── BookCard.tsx        # Individual book card with borrow/return
│   │   │   ├── AddBookForm.tsx     # Form to add new books (Admin)
│   │   │   ├── Navbar.tsx          # Glass morphism navigation bar
│   │   │   ├── Login.tsx           # Auth0 login redirect
│   │   │   ├── ProtectedRoute.tsx  # Route authentication wrapper
│   │   │   ├── AdminDashboard.tsx  # Admin statistics dashboard
│   │   │   ├── BorrowHistory.tsx   # Borrow/return history (Admin)
│   │   │   ├── InventoryManagement.tsx  # Stock management (Admin)
│   │   │   └── UserManagement.tsx  # Grant/revoke admin access
│   │   │
│   │   ├── context/                # State Management
│   │   │   └── AuthContext.tsx     # Auth0 + localStorage sync
│   │   │
│   │   ├── services/               # Business Logic
│   │   │   ├── apiService.ts       # REST API client (backend communication)
│   │   │   ├── mockBackend.ts      # localStorage persistence layer
│   │   │   └── trackingService.ts  # Analytics tracking
│   │   │
│   │   ├── types/                  # TypeScript Definitions
│   │   │   └── index.ts            # User, Book, AuthContext types
│   │   │
│   │   ├── config/                 # Configuration
│   │   │   └── auth0Config.ts      # Auth0 settings & admin emails
│   │   │
│   │   ├── App.tsx                 # Main app component with routing
│   │   └── index.tsx               # React entry point
│   │
│   ├── .env                        # Environment variables (Auth0, API URL)
│   ├── .gitignore                  # Git ignore rules
│   ├── package.json                # Frontend dependencies
│   └── tsconfig.json               # TypeScript configuration
│
├── backend/                        # Express API Server
│   ├── app.js                      # Main server file with all routes
│   ├── package.json                # Backend dependencies
│   ├── .gitignore                  # Git ignore rules
│   └── README.md                   # API documentation
│
├── node_modules/                   # Root dependencies
├── README.md                       # This file
└── .git/                           # Git repository
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Auth0 Account** (free tier works)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd lib-management
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

**Backend Dependencies:**
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `nodemon` (dev) - Auto-reload server

### Step 3: Install Frontend Dependencies
```bash
cd ../client
npm install
```

**Frontend Dependencies:**
- `react` - UI library
- `react-router-dom` - Client-side routing
- `@mui/material` - Material-UI components
- `@auth0/auth0-react` - Auth0 authentication
- `typescript` - Type safety

### Step 4: Configure Environment Variables

Create `client/.env`:
```env
REACT_APP_AUTH0_DOMAIN=dev-ar18ukdobuj84408.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id-here
REACT_APP_API_URL=http://localhost:5000/api
```

**How to get Auth0 credentials:**
1. Sign up at [auth0.com](https://auth0.com)
2. Create a new Application (Single Page Application)
3. Copy Domain and Client ID
4. Add `http://localhost:3000` to Allowed Callback URLs
5. Add `http://localhost:3000` to Allowed Logout URLs

---

## 🏃 Running the Project

### Option 1: Run Both Services (Recommended)

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm run dev
```
✅ Backend API running on `http://localhost:5000`

**Terminal 2 - Start Frontend App:**
```bash
cd client
npm start
```
✅ React app running on `http://localhost:3000`

### Option 2: Production Build
```bash
# Build frontend for production
cd client
npm run build

# Serve static files from backend (optional)
cd ../backend
npm start
```

---

## 🛠️ Tech Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.x | Type safety |
| Material-UI | 7.x | Component library |
| React Router | 7.x | Client-side routing |
| Auth0 React SDK | Latest | Authentication |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime environment |
| Express | 4.x | Web framework |
| CORS | Latest | Cross-origin requests |
| Nodemon | 3.x | Development auto-reload |

### Services & Integrations
| Service | Purpose |
|---------|---------|
| Auth0 | User authentication & authorization |
| localStorage | Client-side data persistence |
| RESTful API | Backend communication |

---

## ✨ Application Functionality

### 🔐 Authentication System
- **Auth0 Universal Login** - Secure hosted login page
- **Social Login** - Google OAuth integration
- **Email/Password Login** - Traditional authentication
- **Role-Based Access** - User vs Admin privileges
- **Admin Detection** - Email-based admin list
- **Session Management** - Token-based authentication

### 📚 Book Management
**For All Users:**
- Browse all available books in a grid layout
- Search books by title, author, or ISBN
- View book details (stock, total copies, ISBN)
- Real-time stock availability status
- Borrow books (max 2 per user)
- Return borrowed books
- View "My Borrowed Books" tab with count

**For Admins:**
- Add new books to the library
- Update book stock quantities
- Delete books (if not borrowed)
- View all books with admin controls

### 👥 User Management (Admin Only)
- View all registered users
- Grant admin access to users
- Revoke admin access from users
- Email-based admin list in localStorage

### 📊 Dashboard & Analytics (Admin Only)
- **Statistics Dashboard:**
  - Total books in library
  - Number of unique titles
  - Currently borrowed books
  - Library utilization rate (%)
  
- **Borrow History:**
  - Complete audit log of all transactions
  - User names and book titles
  - Borrow and return timestamps
  - Filter by user or book

- **Inventory Management:**
  - Update stock for each book
  - Track available vs borrowed copies
  - Prevent stock mismatches

### 🎨 UI/UX Features
- **Glass Morphism Design** - Modern translucent navbar with backdrop blur
- **Responsive Layout** - Mobile, tablet, and desktop support
- **Real-time Updates** - Instant UI refresh without page reload
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages with auto-dismiss
- **Success Feedback** - Confirmation messages for actions
- **Smooth Transitions** - Animated card hover effects
- **Tab Navigation** - Easy switch between all books and borrowed books

### 🔄 Data Flow
1. User authenticates via Auth0 → Gets JWT token
2. Frontend syncs Auth0 user with localStorage → Creates user profile
3. User borrows book → POST to backend API
4. Backend updates in-memory data → Returns updated book & user
5. Frontend syncs to localStorage → Refreshes UI state
6. React components re-render → Shows updated borrowed count

---

## 📖 API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book (Admin)
- `PUT /api/books/:id/stock` - Update stock (Admin)
- `DELETE /api/books/:id` - Delete book (Admin)

### Borrowing
- `POST /api/borrow` - Borrow a book
- `POST /api/return` - Return a book

### Admin
- `GET /api/admin/history` - Get borrow history
- `GET /api/admin/statistics` - Get library statistics
- `GET /api/admin/users` - Get all users

### Health
- `GET /api/health` - Server health check

**See [backend/README.md](backend/README.md) for detailed API documentation.**

---

## 🔑 Default Admin Account

**Email:** `admin@library.com`  
**Password:** Set during first Auth0 login

To add more admins, use the User Management panel or edit `client/src/config/auth0Config.ts`.

---

## 🧪 Testing

```bash
# Run frontend tests (if configured)
cd client
npm test

# Run backend tests (if configured)
cd backend
npm test
```

---

## 📦 Build for Production

```bash
# Build optimized frontend bundle
cd client
npm run build

# Output: client/build/ directory with static files
```

---

## 🐛 Troubleshooting

**Port 5000 already in use:**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

**Auth0 login not working:**
- Check `client/.env` has correct credentials
- Verify callback URLs in Auth0 dashboard
- Clear browser cache and cookies

**Books not updating after borrow:**
- Logout and login again (syncs user ID)
- Check browser console for errors
- Verify backend is running on port 5000

**CORS errors:**
- Backend has CORS enabled by default
- Check `REACT_APP_API_URL` matches backend URL

---

## 📝 Development Notes

- Backend uses in-memory storage (data resets on restart)
- Frontend uses localStorage for persistence
- User ID consistency: Auth0 ID used throughout
- No database required for demo purposes

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

ISC

---

## 👨‍💻 Author

Library Management System - Full Stack Demo Application

---

## 🌟 Features Roadmap

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Book cover images upload
- [ ] Email notifications for overdue books
- [ ] Fine calculation system
- [ ] Book reservations
- [ ] Multi-library support
- [ ] QR code book scanning
- [ ] Mobile app (React Native)

---

**Happy Reading! 📖**
