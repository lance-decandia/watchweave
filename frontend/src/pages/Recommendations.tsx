import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent,
  CardActions, Chip, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { watchlistService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await watchlistService.getAll();
        const ids = new Set<number>(res.data.map((entry: any) => entry.anime_id));
        setWatchlistIds(ids);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWatchlist();
  }, [isAuthenticated]);

  const addToWatchlist = async (e: React.MouseEvent, anime: any) => {
    e.stopPropagation();
    try {
      await watchlistService.add({
        anime_id: anime.mal_id,
        anime_title: anime.title,
        anime_image: anime.images?.jpg?.image_url,
        status: 'plan_to_watch',
        episodes_watched: 0,
        total_episodes: anime.episodes || 0,
      });
      setWatchlistIds(prev => new Set(prev).add(anime.mal_id));
    } catch (err) {
      console.error(err);
    }
  };

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
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap>{anime.title}</Typography>
                    <Typography variant="body2">Score: {anime.score}</Typography>
                    <Box sx={{ mt: 1 }}>
                      {anime.genres?.slice(0, 3).map((g: any) => (
                        <Chip key={g.name} label={g.name} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    {watchlistIds.has(anime.mal_id) ? (
                      <Button size="small" disabled>
                        Already in Watchlist
                      </Button>
                    ) : (
                      <Button size="small" onClick={(e) => addToWatchlist(e, anime)}>
                        Add to Watchlist
                      </Button>
                    )}
                  </CardActions>
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
