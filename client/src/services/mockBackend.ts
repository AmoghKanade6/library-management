import { Book, User, BorrowRecord } from '../types';

// Mock data storage
let users: User[] = [
  {
    id: '1',
    email: 'admin@library.com',
    name: 'Admin User',
    role: 'admin',
    provider: 'google',
    borrowedBooks: []
  }
];

let books: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    stock: 3,
    totalCopies: 5,
    borrowedBy: []
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0061120084',
    stock: 0,
    totalCopies: 4,
    borrowedBy: []
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    stock: 2,
    totalCopies: 6,
    borrowedBy: []
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0141439518',
    stock: 5,
    totalCopies: 5,
    borrowedBy: []
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '978-0316769174',
    stock: 1,
    totalCopies: 3,
    borrowedBy: []
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock token storage
let currentToken: string | null = null;

export const mockBackend = {
  // Authentication
  login: async (provider: 'google' | 'github', email: string, name: string, userId?: string): Promise<{ user: User; token: string }> => {
    await delay(800);
    
    // Use provided userId (from Auth0) or email to find user
    let user = userId ? users.find(u => u.id === userId) : users.find(u => u.email === email);
    
    if (!user) {
      user = {
        id: userId || Math.random().toString(36).substr(2, 9), // Use Auth0 ID if provided
        email,
        name,
        role: 'user',
        provider,
        borrowedBooks: []
      };
      users.push(user);
    }
    
    const token = `mock_token_${user.id}_${Date.now()}`;
    currentToken = token;
    
    return { user, token };
  },

  validateToken: async (token: string): Promise<User | null> => {
    await delay(300);
    
    if (token !== currentToken) {
      throw new Error('Invalid token');
    }
    
    const userId = token.split('_')[2];
    const user = users.find(u => u.id === userId);
    return user || null;
  },

  logout: async (): Promise<void> => {
    await delay(200);
    currentToken = null;
  },

  // Books
  getAllBooks: async (): Promise<Book[]> => {
    await delay(500);
    return [...books];
  },

  getBookById: async (id: string): Promise<Book | null> => {
    await delay(300);
    return books.find(b => b.id === id) || null;
  },

  addBook: async (book: Omit<Book, 'id' | 'borrowedBy'>): Promise<Book> => {
    await delay(600);
    
    const newBook: Book = {
      ...book,
      id: Math.random().toString(36).substr(2, 9),
      borrowedBy: []
    };
    
    books.push(newBook);
    return newBook;
  },

  updateBook: async (id: string, updates: Partial<Book>): Promise<Book> => {
    await delay(600);
    
    const bookIndex = books.findIndex(b => b.id === id);
    if (bookIndex === -1) {
      throw new Error('Book not found');
    }
    
    books[bookIndex] = { ...books[bookIndex], ...updates };
    return books[bookIndex];
  },

  deleteBook: async (id: string): Promise<void> => {
    await delay(400);
    books = books.filter(b => b.id !== id);
  },

  // Borrowing
  borrowBook: async (bookId: string, userId: string, userName: string): Promise<Book> => {
    await delay(700);
    
    const book = books.find(b => b.id === bookId);
    const user = users.find(u => u.id === userId);
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (book.stock <= 0) {
      throw new Error('Book is out of stock');
    }
    
    if (user.borrowedBooks.length >= 2) {
      throw new Error('You have already borrowed 2 books. Please return a book before borrowing another.');
    }
    
    const borrowRecord: BorrowRecord = {
      userId,
      userName,
      borrowedDate: new Date().toISOString(),
      status: 'borrowed'
    };
    
    book.borrowedBy.push(borrowRecord);
    book.stock -= 1;
    user.borrowedBooks.push(bookId);
    
    return book;
  },

  returnBook: async (bookId: string, userId: string): Promise<Book> => {
    await delay(700);
    
    const book = books.find(b => b.id === bookId);
    const user = users.find(u => u.id === userId);
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const borrowRecord = book.borrowedBy.find(
      br => br.userId === userId && br.status === 'borrowed'
    );
    
    if (!borrowRecord) {
      throw new Error('You have not borrowed this book');
    }
    
    borrowRecord.status = 'returned';
    borrowRecord.returnDate = new Date().toISOString();
    book.stock += 1;
    user.borrowedBooks = user.borrowedBooks.filter(id => id !== bookId);
    
    return book;
  },

  // Admin functions
  getBorrowHistory: async (): Promise<{ book: Book; record: BorrowRecord }[]> => {
    await delay(500);
    
    const history: { book: Book; record: BorrowRecord }[] = [];
    
    books.forEach(book => {
      book.borrowedBy.forEach(record => {
        history.push({ book, record });
      });
    });
    
    return history.sort((a, b) => 
      new Date(b.record.borrowedDate).getTime() - new Date(a.record.borrowedDate).getTime()
    );
  },

  updateStock: async (bookId: string, newStock: number, newTotalCopies: number): Promise<Book> => {
    await delay(600);
    
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    if (newStock < 0 || newTotalCopies < 0) {
      throw new Error('Stock and total copies cannot be negative');
    }
    
    const borrowedCount = book.borrowedBy.filter(br => br.status === 'borrowed').length;
    
    if (newStock + borrowedCount > newTotalCopies) {
      throw new Error('Stock manipulation detected: available + borrowed cannot exceed total copies');
    }
    
    book.stock = newStock;
    book.totalCopies = newTotalCopies;
    
    return book;
  }
};
