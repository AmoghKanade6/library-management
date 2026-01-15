import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import * as apiService from '../services/apiService';
import { Book } from '../types';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';

const AdminDashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    uniqueTitles: 0,
    borrowedBooks: 0,
    utilizationRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allBooks, statistics] = await Promise.all([
          apiService.getBooks(),
          apiService.getStatistics()
        ]);
        setBooks(allBooks);
        setStats(statistics);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalBooks = stats.totalBooks;
  const totalTitles = stats.uniqueTitles;
  const borrowedBooks = stats.borrowedBooks;
  const utilizationRate = stats.utilizationRate;

  const statCards = [
    {
      title: 'Total Books',
      value: totalBooks,
      icon: <BookIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      bgColor: '#e3f2fd'
    },
    {
      title: 'Unique Titles',
      value: totalTitles,
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      bgColor: '#e8f5e9'
    },
    {
      title: 'Currently Borrowed',
      value: borrowedBooks,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      bgColor: '#fff3e0'
    },
    {
      title: 'Utilization Rate',
      value: `${utilizationRate}%`,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      bgColor: '#f3e5f5'
    }
  ];

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
        📊 Library Overview
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3,
          mb: 4
        }}
      >
        {statCards.map((stat, index) => (
          <Card
            key={index}
            sx={{
              background: `linear-gradient(135deg, ${stat.bgColor} 0%, ${stat.bgColor} 100%)`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: 2,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color={stat.color}>
                    {stat.value}
                  </Typography>
                </Box>
                <Box sx={{ color: stat.color, opacity: 0.8 }}>
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom fontWeight="600">
          Stock Status by Title
        </Typography>
        <Box sx={{ mt: 2 }}>
          {books.map((book) => {
            const percentage = (book.stock / book.totalCopies) * 100;
            return (
              <Box key={book.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" fontWeight="500">
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.stock} / {book.totalCopies}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: percentage > 50 ? '#2e7d32' : percentage > 20 ? '#ed6c02' : '#d32f2f',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
