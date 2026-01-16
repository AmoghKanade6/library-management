import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Stack,
  Tab,
  Tabs,
  Card,
  CardMedia
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as apiService from '../services/apiService';

const AddBookForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    stock: '',
    totalCopies: '',
    imageUrl: ''
  });
  const [imageTab, setImageTab] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({
          ...formData,
          imageUrl: base64String
        });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
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
        stock,
        imageUrl: formData.imageUrl
      });

      setSuccess('Book added successfully!');
      setFormData({
        title: '',
        author: '',
        isbn: '',
        stock: '',
        totalCopies: '',
        imageUrl: ''
      });
      setImagePreview(null);
      setImageTab(0);
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
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#64748b' }}>
              Book Cover Image (optional)
            </Typography>
            <Tabs value={imageTab} onChange={(_, newValue) => setImageTab(newValue)} sx={{ mb: 2 }}>
              <Tab label="URL" />
              <Tab label="Upload" />
            </Tabs>
            
            {imageTab === 0 ? (
              <TextField
                fullWidth
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/book-cover.jpg"
                helperText="Enter a URL to a book cover image"
              />
            ) : (
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
                {imagePreview && (
                  <Card sx={{ maxWidth: 200, mx: 'auto' }}>
                    <CardMedia
                      component="img"
                      image={imagePreview}
                      alt="Preview"
                      sx={{ height: 250, objectFit: 'contain' }}
                    />
                  </Card>
                )}
              </Box>
            )}
          </Box>
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
