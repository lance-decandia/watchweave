import React from 'react';
import { Container, Box, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', py: 8 }}>

          {/* Logo */}
          <Box sx={{
            width: 80, height: 80, borderRadius: '20px',
            background: 'linear-gradient(135deg, #7B2FBE, #9C27B0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '48px', color: 'white',
            fontFamily: 'Georgia, serif', mb: 3, boxShadow: '0 8px 32px rgba(123, 47, 190, 0.4)'
          }}>
            W
          </Box>

          {/* Title */}
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            WatchWeave
          </Typography>

          {/* Tagline */}
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, maxWidth: 600 }}>
            Track, discover, and get personalized recommendations for your next favorite anime
          </Typography>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 8 }}>
            {isAuthenticated ? (
              <>
                <Button variant="contained" size="large"
                  sx={{ backgroundColor: '#7B2FBE', '&:hover': { backgroundColor: '#6a1fa8' }, px: 4 }}
                  onClick={() => navigate('/search')}>
                  Search Anime
                </Button>
                <Button variant="outlined" size="large"
                  sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#7B2FBE', color: '#7B2FBE' }, px: 4 }}
                  onClick={() => navigate('/recommendations')}>
                  My Recommendations
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" size="large"
                  sx={{ backgroundColor: '#7B2FBE', '&:hover': { backgroundColor: '#6a1fa8' }, px: 4 }}
                  onClick={() => navigate('/register')}>
                  Get Started
                </Button>
                <Button variant="outlined" size="large"
                  sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#7B2FBE', color: '#7B2FBE' }, px: 4 }}
                  onClick={() => navigate('/login')}>
                  Login
                </Button>
              </>
            )}
          </Box>

          {/* Feature Cards */}
          <Grid container spacing={3} sx={{ maxWidth: 900 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#7B2FBE', mb: 1 }}>Search</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Search thousands of anime titles with detailed info, scores, and genre tags
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#7B2FBE', mb: 1 }}>Watchlist</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Track what you're watching, completed, or plan to watch with episode progress
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#7B2FBE', mb: 1 }}>Recommendations</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Get personalized anime recommendations powered by content-based filtering
                </Typography>
              </Paper>
            </Grid>
          </Grid>

        </Box>
      </Container>
    </Box>
  );
};

export default Home;
