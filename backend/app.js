const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock Database (In-memory storage)
let books = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    stock: 3,
    totalCopies: 5,
    borrowedBy: [],
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71FTb9X6wsL.jpg'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    stock: 0,
    totalCopies: 4,
    borrowedBy: [],
    imageUrl: 'https://m.media-amazon.com/images/I/81aY1lxk+9L._AC_UF1000,1000_QL80_.jpg'
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    stock: 2,
    totalCopies: 6,
    borrowedBy: [],
    imageUrl: 'https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    stock: 5,
    totalCopies: 5,
    borrowedBy: [],
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg'
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '9780316769488',
    stock: 1,
    totalCopies: 3,
    borrowedBy: [],
    imageUrl: 'https://m.media-amazon.com/images/I/8125BDk3l9L._AC_UF1000,1000_QL80_.jpg'
  }
];

let users = {};
let borrowHistory = [];
let bookIdCounter = 6;

// ==================== BOOKS ROUTES ====================

// GET /api/books - Get all books
app.get('/api/books', (req, res) => {
  res.json({
    success: true,
    data: books,
    message: 'Books retrieved successfully'
  });
});

// GET /api/books/:id - Get book by ID
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  res.json({
    success: true,
    data: book,
    message: 'Book retrieved successfully'
  });
});

// POST /api/books - Create new book (Admin only)
app.post('/api/books', (req, res) => {
  const { title, author, isbn, stock, imageUrl } = req.body;
  
  // Validation
  if (!title || !author || !isbn || stock === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: title, author, isbn, stock'
    });
  }
  
  // Check if ISBN already exists
  const existingBook = books.find(b => b.isbn === isbn);
  if (existingBook) {
    return res.status(400).json({
      success: false,
      message: 'Book with this ISBN already exists'
    });
  }
  
  const newBook = {
    id: String(bookIdCounter++),
    title,
    author,
    isbn,
    stock: parseInt(stock),
    totalCopies: parseInt(stock),
    borrowedBy: [],
    imageUrl: imageUrl || undefined
  };
  
  books.push(newBook);
  
  res.status(201).json({
    success: true,
    data: newBook,
    message: 'Book created successfully'
  });
});

// PUT /api/books/:id/stock - Update book stock (Admin only)
app.put('/api/books/:id/stock', (req, res) => {
  const { stock, totalCopies } = req.body;
  const book = books.find(b => b.id === req.params.id);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  if (stock === undefined || stock < 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid stock value'
    });
  }
  
  const borrowedCount = book.borrowedBy.filter(b => b.status === 'borrowed').length;
  
  // If totalCopies is provided, update it
  if (totalCopies !== undefined) {
    if (totalCopies < 0) {
      return res.status(400).json({
        success: false,
        message: 'Total copies cannot be negative'
      });
    }
    
    if (totalCopies < borrowedCount) {
      return res.status(400).json({
        success: false,
        message: `Total copies cannot be less than currently borrowed count (${borrowedCount})`
      });
    }
    
    book.totalCopies = parseInt(totalCopies);
  }
  
  const maxAllowedStock = book.totalCopies - borrowedCount;
  
  if (stock > maxAllowedStock) {
    return res.status(400).json({
      success: false,
      message: `Cannot set stock higher than ${maxAllowedStock} (${borrowedCount} copies are currently borrowed)`
    });
  }
  
  book.stock = parseInt(stock);
  
  res.json({
    success: true,
    data: book,
    message: 'Stock updated successfully'
  });
});

// DELETE /api/books/:id - Delete book (Admin only)
app.delete('/api/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === req.params.id);
  
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  const book = books[bookIndex];
  const borrowedCount = book.borrowedBy.filter(b => b.status === 'borrowed').length;
  
  if (borrowedCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete book with active borrows'
    });
  }
  
  books.splice(bookIndex, 1);
  
  res.json({
    success: true,
    message: 'Book deleted successfully'
  });
});

// ==================== BORROW ROUTES ====================

// POST /api/borrow - Borrow a book
app.post('/api/borrow', (req, res) => {
  const { userId, bookId, userName } = req.body;
  
  if (!userId || !bookId || !userName) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: userId, bookId, userName'
    });
  }
  
  const book = books.find(b => b.id === bookId);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  if (book.stock <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Book is not available for borrowing'
    });
  }
  
  // Initialize user if doesn't exist
  if (!users[userId]) {
    users[userId] = {
      id: userId,
      borrowedBooks: []
    };
  }
  
  const user = users[userId];
  
  // Check if user already borrowed this book
  const alreadyBorrowed = book.borrowedBy.some(
    b => b.userId === userId && b.status === 'borrowed'
  );
  
  if (alreadyBorrowed) {
    return res.status(400).json({
      success: false,
      message: 'You have already borrowed this book'
    });
  }
  
  // Check borrow limit (max 2 books)
  if (user.borrowedBooks.length >= 2) {
    return res.status(400).json({
      success: false,
      message: 'You have reached the maximum borrow limit (2 books)'
    });
  }
  
  // Process borrow
  const borrowRecord = {
    userId,
    userName,
    borrowedDate: new Date().toISOString(),
    status: 'borrowed'
  };
  
  book.borrowedBy.push(borrowRecord);
  book.stock -= 1;
  user.borrowedBooks.push(bookId);
  
  // Add to history
  borrowHistory.push({
    ...borrowRecord,
    bookId,
    bookTitle: book.title,
    action: 'borrowed'
  });
  
  res.json({
    success: true,
    data: {
      book,
      user
    },
    message: 'Book borrowed successfully'
  });
});

// POST /api/return - Return a book
app.post('/api/return', (req, res) => {
  const { userId, bookId } = req.body;
  
  if (!userId || !bookId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: userId, bookId'
    });
  }
  
  const book = books.find(b => b.id === bookId);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  const user = users[userId];
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const borrowRecordIndex = book.borrowedBy.findIndex(
    b => b.userId === userId && b.status === 'borrowed'
  );
  
  if (borrowRecordIndex === -1) {
    return res.status(400).json({
      success: false,
      message: 'You have not borrowed this book'
    });
  }
  
  // Process return
  book.borrowedBy[borrowRecordIndex].status = 'returned';
  book.borrowedBy[borrowRecordIndex].returnDate = new Date().toISOString();
  book.stock += 1;
  
  const userBookIndex = user.borrowedBooks.indexOf(bookId);
  if (userBookIndex > -1) {
    user.borrowedBooks.splice(userBookIndex, 1);
  }
  
  // Add to history
  borrowHistory.push({
    userId,
    userName: book.borrowedBy[borrowRecordIndex].userName,
    bookId,
    bookTitle: book.title,
    borrowedDate: book.borrowedBy[borrowRecordIndex].borrowedDate,
    returnDate: book.borrowedBy[borrowRecordIndex].returnDate,
    action: 'returned',
    status: 'returned'
  });
  
  res.json({
    success: true,
    data: {
      book,
      user
    },
    message: 'Book returned successfully'
  });
});

// ==================== ADMIN ROUTES ====================

// GET /api/admin/history - Get borrow history
app.get('/api/admin/history', (req, res) => {
  res.json({
    success: true,
    data: borrowHistory.reverse(),
    message: 'Borrow history retrieved successfully'
  });
});

// GET /api/admin/statistics - Get library statistics
app.get('/api/admin/statistics', (req, res) => {
  const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const uniqueTitles = books.length;
  const borrowedBooks = books.reduce((sum, book) => {
    return sum + book.borrowedBy.filter(b => b.status === 'borrowed').length;
  }, 0);
  const utilizationRate = totalBooks > 0 ? (borrowedBooks / totalBooks) * 100 : 0;
  
  res.json({
    success: true,
    data: {
      totalBooks,
      uniqueTitles,
      borrowedBooks,
      utilizationRate: parseFloat(utilizationRate.toFixed(1))
    },
    message: 'Statistics retrieved successfully'
  });
});

// GET /api/admin/users - Get all users
app.get('/api/admin/users', (req, res) => {
  const userList = Object.values(users);
  
  res.json({
    success: true,
    data: userList,
    message: 'Users retrieved successfully'
  });
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Library Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Library Management API running on port ${PORT}`);
  console.log(`📚 Mock data loaded: ${books.length} books`);
});

module.exports = app;
