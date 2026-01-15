import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Stack
} from '@mui/material';
import * as apiService from '../services/apiService';

const AddBookForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    stock: '',
    totalCopies: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const stock = parseInt(formData.stock);
      const totalCopies = parseInt(formData.totalCopies);

      if (stock < 0 || totalCopies < 0) {
        throw new Error('Stock and total copies must be non-negative');
      }

      if (stock > totalCopies) {
        throw new Error('Available stock cannot exceed total copies');
      }

      await apiService.createBook({
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        stock
      });

      setSuccess('Book added successfully!');
      setFormData({
        title: '',
        author: '',
        isbn: '',
        stock: '',
        totalCopies: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Book
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

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            required
            label="Book Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            label="ISBN"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              fullWidth
              required
              type="number"
              label="Available Stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              required
              type="number"
              label="Total Copies"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : 'Add Book'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default AddBookForm;
