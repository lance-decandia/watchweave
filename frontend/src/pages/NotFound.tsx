import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '80vh', textAlign: 'center'
    }}>
      <Box sx={{
        width: 80, height: 80, borderRadius: '20px',
        background: 'linear-gradient(135deg, #7B2FBE, #9C27B0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', fontSize: '48px', color: 'white',
        fontFamily: 'Georgia, serif', mb: 3
      }}>
        W
      </Box>
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: '#7B2FBE' }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
        Page not found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        The page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" sx={{ backgroundColor: '#7B2FBE' }} onClick={() => navigate('/')}>
        Go Home
      </Button>
    </Box>
  );
};

export default NotFound;
