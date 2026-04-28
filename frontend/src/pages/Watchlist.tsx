import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia,
  Select, MenuItem, FormControl, InputLabel, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { watchlistService } from '../services/api';
import { WatchlistEntry } from '../types';

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await watchlistService.getAll();
      setWatchlist(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (animeId: number, status: string, episodesWatched: number) => {
    try {
      await watchlistService.update(animeId, { status, episodes_watched: episodesWatched });
      fetchWatchlist();
    } catch (err) {
      console.error(err);
    }
  };

  const removeEntry = async (animeId: number) => {
    try {
      await watchlistService.remove(animeId);
      fetchWatchlist();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>My Watchlist</Typography>
        {watchlist.length === 0 ? (
          <Typography>No anime in your watchlist yet. Search for some!</Typography>
        ) : (
          <Grid container spacing={3}>
            {watchlist.map((entry) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={entry.id}>
                <Card
                  sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', height: '100%' }}
                  onClick={() => navigate(`/anime/${entry.anime_id}`)}
                >
                  <CardMedia component="img" height="160"
                    image={entry.anime_image} alt={entry.anime_title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', flexGrow: 1, mr: 1 }}>
                        {entry.anime_title}
                      </Typography>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); removeEntry(entry.anime_id); }}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2">Episodes Watched:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <input
                        type="number"
                        min={0}
                        max={entry.total_episodes}
                        value={entry.episodes_watched}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStatus(entry.anime_id, entry.status, Number(e.target.value))}
                        style={{ width: 60, padding: '4px', borderRadius: 4, border: '1px solid #ccc' }}
                      />
                      <Typography variant="body2">/ {entry.total_episodes}</Typography>
                    </Box>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select value={entry.status} label="Status"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStatus(entry.anime_id, e.target.value, entry.episodes_watched)}>
                        <MenuItem value="watching">Watching</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="plan_to_watch">Plan to Watch</MenuItem>
                        <MenuItem value="dropped">Dropped</MenuItem>
                      </Select>
                    </FormControl>
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

export default Watchlist;
