import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'linear-gradient(135deg, #7B2FBE, #9C27B0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '18px', color: 'white', fontFamily: 'Georgia, serif'
          }}>
            W
          </Box>
          <Typography variant="h6">WatchWeave</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" onClick={() => navigate('/search')}>Search</Button>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => navigate('/watchlist')}>My Watchlist</Button>
              <Button color="inherit" onClick={() => navigate('/recommendations')}>Recommendations</Button>
              <Button color="inherit" onClick={handleLogout}>Logout ({user?.username})</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
