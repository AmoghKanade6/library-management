# Frontend Integration Guide

## 🔗 Connecting React App to Backend API

### 1. Environment Setup

The `.env` file has been updated with:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. API Service Created

A new API service ([src/services/apiService.ts](src/services/apiService.ts)) handles all backend communication:

```typescript
import * as apiService from '../services/apiService';

// Get all books
const books = await apiService.getBooks();

// Borrow a book
await apiService.borrowBook(userId, bookId, userName);

// Return a book
await apiService.returnBook(userId, bookId);

// Create new book (Admin)
await apiService.createBook({ title, author, isbn, stock });

// Get statistics (Admin)
const stats = await apiService.getStatistics();
```

### 3. Components Updated

The following components now use the backend API:
- ✅ [BookList.tsx](src/components/BookList.tsx) - Fetches books from API
- ✅ [BookCard.tsx](src/components/BookCard.tsx) - Borrow/return via API
- ✅ [AddBookForm.tsx](src/components/AddBookForm.tsx) - Creates books via API

### 4. How to Run Full Stack

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm start
```
React app runs on `http://localhost:3000`

### 5. API Response Format

All API responses follow this structure:
```typescript
{
  success: boolean;
  data?: T;          // The actual data
  message: string;   // Success/error message
}
```

### 6. Error Handling

The API service automatically handles errors:
```typescript
try {
  const books = await apiService.getBooks();
} catch (error) {
  // Error already logged
  // Show user-friendly message
}
```

### 7. Available API Methods

**Books:**
- `getBooks()` - Get all books
- `getBookById(id)` - Get single book
- `createBook(data)` - Create new book
- `updateBookStock(id, stock)` - Update stock
- `deleteBook(id)` - Delete book

**Borrowing:**
- `borrowBook(userId, bookId, userName)` - Borrow
- `returnBook(userId, bookId)` - Return

**Admin:**
- `getBorrowHistory()` - Get borrow history
- `getStatistics()` - Get library stats
- `getAllUsers()` - Get all users

### 8. Next Steps

**Remaining components to update:**
- InventoryManagement.tsx
- BorrowHistory.tsx
- AdminDashboard.tsx

**Example update pattern:**
```typescript
// Before (mockBackend)
import { mockBackend } from '../services/mockBackend';
const books = await mockBackend.getAllBooks();

// After (apiService)
import * as apiService from '../services/apiService';
const books = await apiService.getBooks();
```

### 9. Testing the Integration

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm start`
3. Open `http://localhost:3000`
4. Try borrowing/returning books
5. Check browser DevTools Network tab to see API calls

### 10. CORS Configuration

Backend already configured with CORS to accept requests from React app:
```javascript
app.use(cors());
```

No additional configuration needed!
