import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4
            }}
          >
            <Paper
              elevation={8}
              sx={{
                p: 5,
                textAlign: 'center',
                borderRadius: 3,
                maxWidth: 600
              }}
            >
              <ErrorOutlineIcon
                sx={{
                  fontSize: 80,
                  color: 'error.main',
                  mb: 2
                }}
              />
              <Typography variant="h4" gutterBottom fontWeight="bold" color="error">
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                We're sorry for the inconvenience. An unexpected error has occurred.
              </Typography>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: '#f5f5f5',
                    textAlign: 'left',
                    maxHeight: 200,
                    overflow: 'auto'
                  }}
                >
                  <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem' }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </Typography>
                </Paper>
              )}

              <Button
                variant="contained"
                size="large"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Return to Home
              </Button>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
