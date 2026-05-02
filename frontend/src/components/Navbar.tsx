import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDrawerOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const menuItems = [
    { label: 'Search', path: '/search', show: true },
    { label: 'My Watchlist', path: '/watchlist', show: isAuthenticated },
    { label: 'Recommendations', path: '/recommendations', show: isAuthenticated },
    { label: 'Login', path: '/login', show: !isAuthenticated },
    { label: 'Register', path: '/register', show: !isAuthenticated },
  ];

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

        {/* Desktop menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
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

        {/* Mobile hamburger menu */}
        <IconButton
          color="inherit"
          sx={{ display: { xs: 'flex', md: 'none' } }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 220 }}>
            <List>
              {menuItems.filter(item => item.show).map(item => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton onClick={() => handleNavigate(item.path)}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              {isAuthenticated && (
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemText primary={`Logout (${user?.username})`} />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
