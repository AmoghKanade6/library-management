# Library Management System - Backend API

Backend server for the Library Management System with mock data and REST API routes.

## 🚀 Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Routes

### Books

#### Get All Books
```
GET /api/books
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "9780743273565",
      "stock": 3,
      "totalCopies": 5,
      "borrowedBy": []
    }
  ],
  "message": "Books retrieved successfully"
}
```

#### Get Book by ID
```
GET /api/books/:id
```

#### Create New Book (Admin)
```
POST /api/books
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "isbn": "1234567890",
  "stock": 5
}
```

#### Update Book Stock (Admin)
```
PUT /api/books/:id/stock
Content-Type: application/json

{
  "stock": 10
}
```

#### Delete Book (Admin)
```
DELETE /api/books/:id
```

### Borrow Operations

#### Borrow Book
```
POST /api/borrow
Content-Type: application/json

{
  "userId": "user123",
  "bookId": "1",
  "userName": "John Doe"
}
```

#### Return Book
```
POST /api/return
Content-Type: application/json

{
  "userId": "user123",
  "bookId": "1"
}
```

### Admin Routes

#### Get Borrow History
```
GET /api/admin/history
```

#### Get Statistics
```
GET /api/admin/statistics
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalBooks": 23,
    "uniqueTitles": 5,
    "borrowedBooks": 12,
    "utilizationRate": 52.2
  }
}
```

#### Get All Users
```
GET /api/admin/users
```

### Health Check
```
GET /api/health
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:
```
PORT=5000
```

## 📦 Mock Data

The server includes 5 pre-loaded books:
- The Great Gatsby
- To Kill a Mockingbird
- 1984
- Pride and Prejudice
- The Catcher in the Rye

## 🛡️ Business Rules

- Users can borrow maximum 2 books at a time
- Books must have stock > 0 to be borrowed
- Cannot delete books with active borrows
- Stock cannot exceed (totalCopies - borrowed count)

## 🔄 Connecting Frontend

Update your React app to use this backend:

1. Create `.env` in React app root:
```
REACT_APP_API_URL=http://localhost:5000/api
```

2. Use axios or fetch to call API endpoints

## 📝 Notes

- All data is stored in memory (resets on server restart)
- For production, replace with a real database (MongoDB, PostgreSQL, etc.)
- Add authentication middleware for protected routes
- Add request validation and sanitization
