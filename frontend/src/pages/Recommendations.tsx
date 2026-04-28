import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, Chip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${process.env.REACT_APP_RECOMMENDATION_URL || 'http://localhost:5000'}/recommendations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecommendations(res.data.recommendations || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Recommended For You</Typography>
        {loading ? (
          <CircularProgress />
        ) : recommendations.length === 0 ? (
          <Typography>Add some anime to your watchlist to get recommendations!</Typography>
        ) : (
          <Grid container spacing={3}>
            {recommendations.map((anime) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={anime.mal_id}>
                <Card
                  sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
                  onClick={() => navigate(`/anime/${anime.mal_id}`)}
                >
                  <CardMedia component="img" height="250"
                    image={anime.images?.jpg?.image_url} alt={anime.title} />
                  <CardContent>
                    <Typography variant="h6" noWrap>{anime.title}</Typography>
                    <Typography variant="body2">Score: {anime.score}</Typography>
                    <Box sx={{ mt: 1 }}>
                      {anime.genres?.slice(0, 3).map((g: any) => (
                        <Chip key={g.name} label={g.name} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Recommendations;
