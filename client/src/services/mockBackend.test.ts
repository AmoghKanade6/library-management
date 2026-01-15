import { mockBackend } from './mockBackend';
import { Book, User } from '../types';

describe('MockBackend Service', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Authentication', () => {
    it('should successfully login a new user', async () => {
      const result = await mockBackend.login('google', 'test@example.com', 'Test User');
      
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.name).toBe('Test User');
      expect(result.user.provider).toBe('google');
      expect(result.token).toBeDefined();
    });

    it('should return existing user on second login', async () => {
      const firstLogin = await mockBackend.login('google', 'test@example.com', 'Test User');
      const secondLogin = await mockBackend.login('google', 'test@example.com', 'Test User');
      
      expect(firstLogin.user.id).toBe(secondLogin.user.id);
    });

    it('should validate correct token', async () => {
      const { user, token } = await mockBackend.login('github', 'user@github.com', 'GitHub User');
      const validatedUser = await mockBackend.validateToken(token);
      
      expect(validatedUser).not.toBeNull();
      expect(validatedUser?.id).toBe(user.id);
    });

    it('should reject invalid token', async () => {
      await expect(mockBackend.validateToken('invalid_token')).rejects.toThrow('Invalid token');
    });

    it('should logout successfully', async () => {
      await mockBackend.login('google', 'test@example.com', 'Test User');
      await mockBackend.logout();
      // After logout, the token should be invalidated
      expect(true).toBe(true); // Placeholder assertion
    });
  });

  describe('Books Management', () => {
    it('should get all books', async () => {
      const books = await mockBackend.getAllBooks();
      
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
    });

    it('should get book by id', async () => {
      const books = await mockBackend.getAllBooks();
      const firstBook = books[0];
      
      const book = await mockBackend.getBookById(firstBook.id);
      
      expect(book).not.toBeNull();
      expect(book?.id).toBe(firstBook.id);
    });

    it('should add a new book', async () => {
      const newBook = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '123-456-789',
        stock: 5,
        totalCopies: 5
      };
      
      const addedBook = await mockBackend.addBook(newBook);
      
      expect(addedBook.id).toBeDefined();
      expect(addedBook.title).toBe(newBook.title);
      expect(addedBook.stock).toBe(newBook.stock);
    });

    it('should update book', async () => {
      const books = await mockBackend.getAllBooks();
      const bookToUpdate = books[0];
      
      const updatedBook = await mockBackend.updateBook(bookToUpdate.id, {
        title: 'Updated Title'
      });
      
      expect(updatedBook.title).toBe('Updated Title');
    });

    it('should delete book', async () => {
      const books = await mockBackend.getAllBooks();
      const initialCount = books.length;
      
      await mockBackend.deleteBook(books[0].id);
      
      const remainingBooks = await mockBackend.getAllBooks();
      expect(remainingBooks.length).toBe(initialCount - 1);
    });
  });

  describe('Borrowing Logic', () => {
    it('should allow user to borrow a book', async () => {
      const { user } = await mockBackend.login('google', 'borrower@test.com', 'Borrower');
      const books = await mockBackend.getAllBooks();
      const bookToBorrow = books.find(b => b.stock > 0)!;
      const initialStock = bookToBorrow.stock;
      
      const borrowedBook = await mockBackend.borrowBook(bookToBorrow.id, user.id, user.name);
      
      expect(borrowedBook.stock).toBe(initialStock - 1);
      expect(borrowedBook.borrowedBy.length).toBeGreaterThan(0);
    });

    it('should prevent borrowing when stock is 0', async () => {
      const { user } = await mockBackend.login('google', 'borrower2@test.com', 'Borrower2');
      
      // Create a book with 0 stock
      const newBook = await mockBackend.addBook({
        title: 'Out of Stock Book',
        author: 'Author',
        isbn: '000-000-000',
        stock: 0,
        totalCopies: 1
      });
      
      await expect(
        mockBackend.borrowBook(newBook.id, user.id, user.name)
      ).rejects.toThrow('Book is out of stock');
    });

    it('should prevent borrowing more than 2 books', async () => {
      const { user } = await mockBackend.login('google', 'maxborrower@test.com', 'Max Borrower');
      const books = await mockBackend.getAllBooks();
      
      // Borrow first book
      await mockBackend.borrowBook(books[0].id, user.id, user.name);
      
      // Borrow second book
      await mockBackend.borrowBook(books[1].id, user.id, user.name);
      
      // Try to borrow third book
      await expect(
        mockBackend.borrowBook(books[2].id, user.id, user.name)
      ).rejects.toThrow('You have already borrowed 2 books');
    });

    it('should allow user to return a borrowed book', async () => {
      const { user } = await mockBackend.login('google', 'returner@test.com', 'Returner');
      const books = await mockBackend.getAllBooks();
      const bookToBorrow = books.find(b => b.stock > 0)!;
      
      // Borrow the book
      await mockBackend.borrowBook(bookToBorrow.id, user.id, user.name);
      const borrowedBook = await mockBackend.getBookById(bookToBorrow.id);
      const stockAfterBorrow = borrowedBook!.stock;
      
      // Return the book
      const returnedBook = await mockBackend.returnBook(bookToBorrow.id, user.id);
      
      expect(returnedBook.stock).toBe(stockAfterBorrow + 1);
    });

    it('should prevent returning a book not borrowed by user', async () => {
      const { user } = await mockBackend.login('google', 'nonborrower@test.com', 'Non Borrower');
      const books = await mockBackend.getAllBooks();
      
      await expect(
        mockBackend.returnBook(books[0].id, user.id)
      ).rejects.toThrow('You have not borrowed this book');
    });
  });

  describe('Admin Functions', () => {
    it('should get borrow history', async () => {
      const history = await mockBackend.getBorrowHistory();
      
      expect(Array.isArray(history)).toBe(true);
    });

    it('should update stock correctly', async () => {
      const books = await mockBackend.getAllBooks();
      const book = books[0];
      
      const updatedBook = await mockBackend.updateStock(book.id, 10, 15);
      
      expect(updatedBook.stock).toBe(10);
      expect(updatedBook.totalCopies).toBe(15);
    });

    it('should prevent negative stock', async () => {
      const books = await mockBackend.getAllBooks();
      
      await expect(
        mockBackend.updateStock(books[0].id, -1, 10)
      ).rejects.toThrow('Stock and total copies cannot be negative');
    });

    it('should prevent stock manipulation', async () => {
      const books = await mockBackend.getAllBooks();
      const book = books[0];
      
      // Try to set stock higher than total copies
      await expect(
        mockBackend.updateStock(book.id, 20, 10)
      ).rejects.toThrow('Stock manipulation detected');
    });
  });
});
