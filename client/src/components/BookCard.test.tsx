import React from 'react';
import { render, screen } from '@testing-library/react';
import BookCard from './BookCard';
import { AuthProvider } from '../context/AuthContext';
import { Book } from '../types';

const mockBook: Book = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  isbn: '123-456-789',
  stock: 5,
  totalCopies: 10,
  borrowedBy: []
};

const MockBookCard = ({ book }: { book: Book }) => (
  <AuthProvider>
    <BookCard book={book} onUpdate={() => {}} />
  </AuthProvider>
);

describe('BookCard Component', () => {
  it('renders book information correctly', () => {
    render(<MockBookCard book={mockBook} />);
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText(/Test Author/i)).toBeInTheDocument();
    expect(screen.getByText(/123-456-789/i)).toBeInTheDocument();
  });

  it('shows available stock count', () => {
    render(<MockBookCard book={mockBook} />);
    
    expect(screen.getByText(/5 Available/i)).toBeInTheDocument();
  });

  it('shows out of stock when stock is 0', () => {
    const outOfStockBook = { ...mockBook, stock: 0 };
    render(<MockBookCard book={outOfStockBook} />);
    
    expect(screen.getByText(/Out of Stock/i)).toBeInTheDocument();
  });

  it('shows low stock warning when stock is low', () => {
    const lowStockBook = { ...mockBook, stock: 2 };
    render(<MockBookCard book={lowStockBook} />);
    
    expect(screen.getByText(/2 Available/i)).toBeInTheDocument();
  });

  it('renders borrow button when book is available', () => {
    render(<MockBookCard book={mockBook} />);
    
    expect(screen.getByText(/Borrow Book/i)).toBeInTheDocument();
  });

  it('disables borrow button when out of stock', () => {
    const outOfStockBook = { ...mockBook, stock: 0 };
    render(<MockBookCard book={outOfStockBook} />);
    
    const borrowButton = screen.getByText(/Borrow Book/i);
    expect(borrowButton).toBeDisabled();
  });
});
