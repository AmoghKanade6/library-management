import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HistoryIcon from '@mui/icons-material/History';
import { Book } from '../types';
import * as apiService from '../services/apiService';
import BookCard from './BookCard';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

const BookList: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(searchParams.get('view') === 'borrowed' ? 1 : 0);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allBooks = await apiService.getBooks();
      setBooks(allBooks);
    } catch (err: any) {
      setError(err.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchParams(newValue === 1 ? { view: 'borrowed' } : {});
    setSearchQuery(''); // Clear search when switching tabs
  };

  const filteredBooks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let booksToFilter = books;

    // Filter by tab first
    if (activeTab === 1 && user) {
      // Show only borrowed books (borrowedBooks is array of book IDs)
      booksToFilter = books.filter(book => user.borrowedBooks.includes(book.id));
    }

    // Then filter by search query
    return booksToFilter.filter(
      book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query)
    );
  }, [searchQuery, books, activeTab, user]);

  const borrowedCount = user?.borrowedBooks.length || 0;

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '50vh',
        mt: 4 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
          📚 Book Library
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and borrow from our extensive collection
        </Typography>
      </Box>

      {user && user.role !== 'admin' && (
        <>
          {/* Tabs */}
          <Paper 
            elevation={0}
            sx={{ 
              mb: 3,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  py: 2,
                  textTransform: 'none'
                }
              }}
            >
              <Tab 
                icon={<LibraryBooksIcon />} 
                iconPosition="start" 
                label="All Books" 
              />
              <Tab 
                icon={<HistoryIcon />} 
                iconPosition="start" 
                label={`My Borrowed Books (${borrowedCount})`}
              />
            </Tabs>
          </Paper>

          {/* Borrowed Books Warning */}
          {activeTab === 0 && (
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                mb: 3, 
                background: borrowedCount >= 2 ? 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderRadius: 2,
                border: '1px solid',
                borderColor: borrowedCount >= 2 ? 'warning.light' : 'primary.light'
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="600">
                📖 Your Borrowed Books: {borrowedCount} / 2
              </Typography>
              {borrowedCount >= 2 && (
                <Typography variant="body2" color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ⚠️ You've reached the maximum limit. Return a book to borrow another.
                </Typography>
              )}
            </Paper>
          )}
        </>
      )}

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search books by title, author, or ISBN..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ 
          mb: 4,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {filteredBooks.length === 0 ? (
        <Alert severity="info">
          {activeTab === 1 
            ? 'You haven\'t borrowed any books yet. Switch to "All Books" to start borrowing!' 
            : 'No books found matching your search.'}
        </Alert>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3
          }}
        >
          {filteredBooks.map(book => (
            <Box key={book.id}>
              <BookCard book={book} onUpdate={loadBooks} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default BookList;
