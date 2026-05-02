import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Chip, CircularProgress, Grid
} from '@mui/material';
import { animeService, watchlistService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AnimeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await animeService.getById(Number(id!));
        setAnime(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [id]);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await watchlistService.getAll();
        const watchlist = res.data;
        const alreadyAdded = watchlist.some((entry: any) => entry.anime_id === Number(id));
        setInWatchlist(alreadyAdded);
      } catch (err) {
        console.error(err);
      }
    };
    checkWatchlist();
  }, [id, isAuthenticated]);

  const addToWatchlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await watchlistService.add({
        anime_id: anime.mal_id,
        anime_title: anime.title,
        anime_image: anime.images.jpg.image_url,
        status: 'plan_to_watch',
        episodes_watched: 0,
        total_episodes: anime.episodes || 0,
      });
      setInWatchlist(true);
      setAdded(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );

  if (!anime) return (
    <Container sx={{ mt: 4 }}>
      <Typography>Anime not found.</Typography>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Back</Button>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <img
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h4" gutterBottom>{anime.title}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {anime.title_english && anime.title_english !== anime.title
              ? `English: ${anime.title_english}` : ''}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1"><strong>Score:</strong> {anime.score || 'N/A'}</Typography>
            <Typography variant="body1"><strong>Episodes:</strong> {anime.episodes || 'N/A'}</Typography>
            <Typography variant="body1"><strong>Status:</strong> {anime.status || 'N/A'}</Typography>
            <Typography variant="body1"><strong>Rating:</strong> {anime.rating || 'N/A'}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            {anime.genres?.map((g: any) => (
              <Chip key={g.name} label={g.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
            ))}
          </Box>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {anime.synopsis || 'No description available.'}
          </Typography>
          {!isAuthenticated ? (
            <Button variant="contained" color="secondary" onClick={() => navigate('/login')}>
              Login to Add to Watchlist
            </Button>
          ) : inWatchlist ? (
            <Button variant="contained" disabled>
              {added ? 'Added to Watchlist' : 'Already in Watchlist'}
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={addToWatchlist}>
              Add to Watchlist
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Trailer Section */}
      {anime.trailer?.embed_url && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>Trailer</Typography>
          <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: 2, overflow: 'hidden' }}>
            <iframe
              src={anime.trailer.embed_url}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${anime.title} Trailer`}
            />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default AnimeDetail;
