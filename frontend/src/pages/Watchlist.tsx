import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia,
  Select, MenuItem, FormControl, InputLabel, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { watchlistService } from '../services/api';
import { WatchlistEntry } from '../types';

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);

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
                <Card sx={{ display: 'flex' }}>
                  <CardMedia component="img" sx={{ width: 100 }}
                    image={entry.anime_image} alt={entry.anime_title} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap>{entry.anime_title}</Typography>
                    <Typography variant="body2">
                      {entry.episodes_watched}/{entry.total_episodes} episodes
                    </Typography>
                    <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                      <InputLabel>Status</InputLabel>
                      <Select value={entry.status} label="Status"
                        onChange={(e) => updateStatus(entry.anime_id, e.target.value, entry.episodes_watched)}>
                        <MenuItem value="watching">Watching</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="plan_to_watch">Plan to Watch</MenuItem>
                        <MenuItem value="dropped">Dropped</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                  <IconButton onClick={() => removeEntry(entry.anime_id)} color="error">
                    <DeleteIcon />
                  </IconButton>
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
