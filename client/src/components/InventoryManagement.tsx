import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Book } from '../types';
import * as apiService from '../services/apiService';

const InventoryManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    book: Book | null;
    stock: string;
    totalCopies: string;
  }>({
    open: false,
    book: null,
    stock: '',
    totalCopies: ''
  });

  const loadBooks = async () => {
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
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleEdit = (book: Book) => {
    setEditDialog({
      open: true,
      book,
      stock: book.stock.toString(),
      totalCopies: book.totalCopies.toString()
    });
  };

  const handleCloseDialog = () => {
    setEditDialog({
      open: false,
      book: null,
      stock: '',
      totalCopies: ''
    });
  };

  const handleUpdateStock = async () => {
    if (!editDialog.book) return;

    setError(null);
    setSuccess(null);

    try {
      const stock = parseInt(editDialog.stock);
      const totalCopies = parseInt(editDialog.totalCopies);

      if (stock < 0 || totalCopies < 0) {
        throw new Error('Stock and total copies must be non-negative');
      }

      await apiService.updateBookStock(editDialog.book.id, stock, totalCopies);
      setSuccess('Stock updated successfully!');
      handleCloseDialog();
      loadBooks();
    } catch (err: any) {
      setError(err.message || 'Failed to update stock');
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await apiService.deleteBook(bookId);
      setSuccess('Book deleted successfully!');
      loadBooks();
    } catch (err: any) {
      setError(err.message || 'Failed to delete book');
    }
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
        Manage Inventory
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Author</strong></TableCell>
              <TableCell><strong>ISBN</strong></TableCell>
              <TableCell align="center"><strong>Available</strong></TableCell>
              <TableCell align="center"><strong>Borrowed</strong></TableCell>
              <TableCell align="center"><strong>Total</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map(book => {
              const borrowedCount = book.borrowedBy.filter(br => br.status === 'borrowed').length;
              return (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell align="center">{book.stock}</TableCell>
                  <TableCell align="center">{borrowedCount}</TableCell>
                  <TableCell align="center">{book.totalCopies}</TableCell>
                  <TableCell align="center">
                    {book.stock === 0 ? (
                      <Chip label="Out of Stock" color="error" size="small" />
                    ) : book.stock <= 2 ? (
                      <Chip label="Low Stock" color="warning" size="small" />
                    ) : (
                      <Chip label="In Stock" color="success" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(book)} color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(book.id)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>Update Stock - {editDialog.book?.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Currently borrowed: {editDialog.book?.borrowedBy.filter(br => br.status === 'borrowed').length || 0}
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Available Stock"
              type="number"
              value={editDialog.stock}
              onChange={(e) => setEditDialog({ ...editDialog, stock: e.target.value })}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Total Copies"
              type="number"
              value={editDialog.totalCopies}
              onChange={(e) => setEditDialog({ ...editDialog, totalCopies: e.target.value })}
              inputProps={{ min: 0 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateStock} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryManagement;
