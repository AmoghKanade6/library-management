import { Book, User } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

interface BorrowHistoryItem {
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  borrowedDate: string;
  returnDate?: string;
  action: 'borrowed' | 'returned';
  status: 'borrowed' | 'returned';
}

interface Statistics {
  totalBooks: number;
  uniqueTitles: number;
  borrowedBooks: number;
  utilizationRate: number;
}

// Helper function for API calls
const apiCall = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== BOOKS ====================

export const getBooks = async (): Promise<Book[]> => {
  const response = await apiCall<Book[]>('/books');
  return response.data || [];
};

export const getBookById = async (bookId: string): Promise<Book | null> => {
  try {
    const response = await apiCall<Book>(`/books/${bookId}`);
    return response.data || null;
  } catch (error) {
    return null;
  }
};

export const createBook = async (bookData: {
  title: string;
  author: string;
  isbn: string;
  stock: number;
}): Promise<Book> => {
  const response = await apiCall<Book>('/books', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });

  if (!response.data) {
    throw new Error(response.message || 'Failed to create book');
  }

  return response.data;
};

export const updateBookStock = async (
  bookId: string,
  stock: number,
  totalCopies?: number
): Promise<Book> => {
  const body: any = { stock };
  if (totalCopies !== undefined) {
    body.totalCopies = totalCopies;
  }
  
  const response = await apiCall<Book>(`/books/${bookId}/stock`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!response.data) {
    throw new Error(response.message || 'Failed to update stock');
  }

  return response.data;
};

export const deleteBook = async (bookId: string): Promise<void> => {
  await apiCall(`/books/${bookId}`, {
    method: 'DELETE',
  });
};

// ==================== BORROW OPERATIONS ====================

export const borrowBook = async (
  userId: string,
  bookId: string,
  userName: string
): Promise<{ book: Book; user: Partial<User> }> => {
  const response = await apiCall<{ book: Book; user: Partial<User> }>(
    '/borrow',
    {
      method: 'POST',
      body: JSON.stringify({ userId, bookId, userName }),
    }
  );

  if (!response.data) {
    throw new Error(response.message || 'Failed to borrow book');
  }

  // Sync with localStorage
  const users = JSON.parse(localStorage.getItem('library_users') || '[]');
  const userIndex = users.findIndex((u: any) => u.id === userId);
  
  if (userIndex !== -1 && response.data.user.borrowedBooks) {
    users[userIndex].borrowedBooks = response.data.user.borrowedBooks;
    localStorage.setItem('library_users', JSON.stringify(users));
  } else if (response.data.user.borrowedBooks) {
    // Create new user entry if not found
    users.push({
      id: userId,
      borrowedBooks: response.data.user.borrowedBooks
    });
    localStorage.setItem('library_users', JSON.stringify(users));
  }

  return response.data;
};

export const returnBook = async (
  userId: string,
  bookId: string
): Promise<{ book: Book; user: Partial<User> }> => {
  const response = await apiCall<{ book: Book; user: Partial<User> }>(
    '/return',
    {
      method: 'POST',
      body: JSON.stringify({ userId, bookId }),
    }
  );

  if (!response.data) {
    throw new Error(response.message || 'Failed to return book');
  }

  // Sync with localStorage
  const users = JSON.parse(localStorage.getItem('library_users') || '[]');
  const userIndex = users.findIndex((u: any) => u.id === userId);
  
  if (userIndex !== -1 && response.data.user.borrowedBooks !== undefined) {
    users[userIndex].borrowedBooks = response.data.user.borrowedBooks;
    localStorage.setItem('library_users', JSON.stringify(users));
  }

  return response.data;
};

// ==================== ADMIN OPERATIONS ====================

export const getBorrowHistory = async (): Promise<BorrowHistoryItem[]> => {
  const response = await apiCall<BorrowHistoryItem[]>('/admin/history');
  return response.data || [];
};

export const getStatistics = async (): Promise<Statistics> => {
  const response = await apiCall<Statistics>('/admin/statistics');
  return (
    response.data || {
      totalBooks: 0,
      uniqueTitles: 0,
      borrowedBooks: 0,
      utilizationRate: 0,
    }
  );
};

export const getAllUsers = async (): Promise<Partial<User>[]> => {
  const response = await apiCall<Partial<User>[]>('/admin/users');
  return response.data || [];
};

// ==================== HEALTH CHECK ====================

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await apiCall('/health');
    return response.success;
  } catch (error) {
    return false;
  }
};

export default {
  getBooks,
  getBookById,
  createBook,
  updateBookStock,
  deleteBook,
  borrowBook,
  returnBook,
  getBorrowHistory,
  getStatistics,
  getAllUsers,
  checkHealth,
};
