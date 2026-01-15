import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Typography,
  Chip
} from '@mui/material';
import * as apiService from '../services/apiService';

interface HistoryRecord {
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  borrowedDate: string;
  returnDate?: string;
  action: 'borrowed' | 'returned';
  status: 'borrowed' | 'returned';
}

const BorrowHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getBorrowHistory();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Borrow & Return History
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {history.length === 0 ? (
        <Alert severity="info">No borrow history yet.</Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Book Title</strong></TableCell>
                <TableCell><strong>User</strong></TableCell>
                <TableCell><strong>Borrowed Date</strong></TableCell>
                <TableCell><strong>Return Date</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.bookTitle}</TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>{formatDate(item.borrowedDate)}</TableCell>
                  <TableCell>
                    {item.returnDate ? formatDate(item.returnDate) : '-'}
                  </TableCell>
                  <TableCell align="center">
                    {item.status === 'borrowed' ? (
                      <Chip label="Borrowed" color="warning" size="small" />
                    ) : (
                      <Chip label="Returned" color="success" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default BorrowHistory;
