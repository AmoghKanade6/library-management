export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  provider: 'google' | 'github';
  borrowedBooks: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  stock: number;
  totalCopies: number;
  borrowedBy: BorrowRecord[];
}

export interface BorrowRecord {
  userId: string;
  userName: string;
  borrowedDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned';
}

export interface AuthContextType {
  user: User | null;
  login: (provider: 'google' | 'github') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;  refreshUser: () => Promise<void>;}
