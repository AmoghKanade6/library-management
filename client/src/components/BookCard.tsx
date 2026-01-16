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
      await apiService.borrowBook(user.id, book.id, user.name);
      
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
      await apiService.returnBook(user.id, book.id);
      
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
      return (
        <Chip 
          label="Out of Stock" 
          size="small" 
          sx={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
            border: 'none'
          }}
        />
      );
    } else if (book.stock <= 2) {
      return (
        <Chip 
          label={`${book.stock} Available`} 
          size="small" 
          sx={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
            border: 'none'
          }}
        />
      );
    } else {
      return (
        <Chip 
          label={`${book.stock} Available`} 
          size="small" 
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
            border: 'none'
          }}
        />
      );
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        borderRadius: 3,
        border: '1px solid rgba(99, 102, 241, 0.1)',
        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          opacity: 0,
          transition: 'opacity 0.4s ease'
        },
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 20px 60px rgba(99, 102, 241, 0.25), 0 8px 24px rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          '&::before': {
            opacity: 1
          }
        }
      }}
    >
      {book.imageUrl && (
        <Box
          sx={{
            width: '100%',
            height: 300,
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2
          }}
        >
          <img
            src={book.imageUrl}
            alt={book.title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              transition: 'transform 0.4s ease',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom 
          fontWeight="700" 
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1.5,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em'
          }}
        >
          {book.title}
        </Typography>
        <Typography 
          variant="body2" 
          gutterBottom 
          sx={{ 
            fontStyle: 'italic',
            color: '#64748b',
            fontWeight: 500,
            mb: 0.5
          }}
        >
          by {book.author}
        </Typography>
        <Typography 
          variant="caption" 
          display="block" 
          gutterBottom
          sx={{
            color: '#94a3b8',
            fontSize: '0.75rem'
          }}
        >
          ISBN: {book.isbn}
        </Typography>
        
        <Box sx={{ mt: 2.5, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          {getStockStatus()}
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#94a3b8',
              fontWeight: 500,
              fontSize: '0.75rem'
            }}
          >
            ({book.totalCopies} total)
          </Typography>
        </Box>

        {isBorrowedByUser && (
          <Chip 
            label="✓ You borrowed this" 
            size="small" 
            sx={{ 
              mt: 1, 
              fontWeight: 600,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              border: 'none'
            }} 
          />
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              animation: 'slideIn 0.3s ease-out',
              '@keyframes slideIn': {
                from: {
                  opacity: 0,
                  transform: 'translateY(-10px)'
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mt: 2, 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              animation: 'slideIn 0.3s ease-out',
              '@keyframes slideIn': {
                from: {
                  opacity: 0,
                  transform: 'translateY(-10px)'
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}
          >
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
              fontWeight: 700,
              borderRadius: 2.5,
              py: 1.5,
              borderWidth: 2,
              borderColor: '#6366f1',
              color: '#6366f1',
              background: 'rgba(99, 102, 241, 0.04)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderWidth: 2,
                borderColor: '#8b5cf6',
                background: 'rgba(139, 92, 246, 0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
              },
              '&:disabled': {
                borderColor: '#cbd5e1',
                color: '#cbd5e1'
              }
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: '#6366f1' }} /> : 'Return Book'}
          </Button>
        ) : (
          <Button
            size="large"
            variant="contained"
            onClick={handleBorrow}
            disabled={loading || book.stock === 0}
            fullWidth
            sx={{ 
              fontWeight: 700,
              borderRadius: 2.5,
              py: 1.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                boxShadow: '0 8px 28px rgba(99, 102, 241, 0.5)',
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                background: '#e2e8f0',
                color: '#94a3b8',
                boxShadow: 'none'
              }
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Borrow Book'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
});

export default BookCard;
