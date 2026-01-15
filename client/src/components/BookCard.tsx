import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Book } from '../types';
import { useAuth } from '../context/AuthContext';
import * as apiService from '../services/apiService';
import { trackingService } from '../services/trackingService';

interface BookCardProps {
  book: Book;
  onUpdate: () => void;
}

const BookCard: React.FC<BookCardProps> = React.memo(({ book, onUpdate }) => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isBorrowedByUser = user && book.borrowedBy.some(
    br => br.userId === user.id && br.status === 'borrowed'
  );

  const handleBorrow = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await apiService.borrowBook(user.id, book.id, user.name);
      
      setSuccess('Book borrowed successfully!');
      trackingService.trackBookBorrow(user.id, book.id, book.title);
      
      // Refresh user context and UI simultaneously for smooth update
      await Promise.all([
        refreshUser(),
        onUpdate()
      ]);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to borrow book');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await apiService.returnBook(user.id, book.id);
      
      setSuccess('Book returned successfully!');
      trackingService.trackBookReturn(user.id, book.id, book.title);
      
      // Refresh user context and UI simultaneously for smooth update
      await Promise.all([
        refreshUser(),
        onUpdate()
      ]);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to return book');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = () => {
    if (book.stock === 0) {
      return <Chip label="Out of Stock" color="error" size="small" />;
    } else if (book.stock <= 2) {
      return <Chip label={`${book.stock} Available`} color="warning" size="small" />;
    } else {
      return <Chip label={`${book.stock} Available`} color="success" size="small" />;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
        },
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom fontWeight="600" color="primary">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic' }}>
          by {book.author}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          ISBN: {book.isbn}
        </Typography>
        
        <Box sx={{ mt: 2, mb: 1 }}>
          {getStockStatus()}
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            ({book.totalCopies} total)
          </Typography>
        </Box>

        {isBorrowedByUser && (
          <Chip label="You borrowed this" color="primary" size="small" sx={{ mt: 1, fontWeight: 600 }} />
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2, borderRadius: 1.5 }}>
            {success}
          </Alert>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {isBorrowedByUser ? (
          <Button
            size="large"
            variant="outlined"
            onClick={handleReturn}
            disabled={loading}
            fullWidth
            sx={{ 
              fontWeight: 600,
              borderRadius: 2,
              py: 1
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Return Book'}
          </Button>
        ) : (
          <Button
            size="large"
            variant="contained"
            onClick={handleBorrow}
            disabled={loading || book.stock === 0}
            fullWidth
            sx={{ 
              fontWeight: 600,
              borderRadius: 2,
              py: 1,
              boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)'
              }
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Borrow Book'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
});

export default BookCard;
