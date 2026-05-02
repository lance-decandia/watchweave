import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Grid, Card, CardMedia,
  CardContent, Typography, CardActions, Chip, Skeleton, Select,
  MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { animeService, watchlistService } from '../services/api';
import { Anime } from '../types';
import { useAuth } from '../context/AuthContext';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setPage(1);
    await fetchResults(1);
  };

  const fetchResults = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await animeService.search(query, pageNum);
      let data = res.data.data || [];
      
      // Sort results
      if (sortBy === 'score') {
        data = [...data].sort((a: Anime, b: Anime) => (b.score || 0) - (a.score || 0));
      } else if (sortBy === 'title') {
        data = [...data].sort((a: Anime, b: Anime) => a.title.localeCompare(b.title));
      }
      
      setResults(data);
      setHasNextPage(res.data.pagination?.has_next_page || false);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchResults(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToWatchlist = async (e: React.MouseEvent, anime: Anime) => {
    e.stopPropagation();
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
      setWatchlistIds(prev => new Set(prev).add(anime.mal_id));
    } catch (err) {
      console.error(err);
    }
  };

  const SkeletonCard = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={250} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={60} height={24} />
        </Box>
      </CardContent>
      <CardActions>
        <Skeleton variant="text" width={100} />
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Search Anime</Typography>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField fullWidth label="Search anime..." value={query}
            onChange={(e) => setQuery(e.target.value)} />
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Box>

        {results.length > 0 && (
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="score">Highest Score</MenuItem>
                <MenuItem value="title">Title (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        <Grid container spacing={3}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                <SkeletonCard />
              </Grid>
            ))
          ) : (
            results.map((anime) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={anime.mal_id}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                  onClick={() => navigate(`/anime/${anime.mal_id}`)}
                >
                  <CardMedia component="img" height="250"
                    image={anime.images.jpg.image_url} alt={anime.title} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap>{anime.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Episodes: {anime.episodes || 'N/A'} | Score: {anime.score || 'N/A'}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {anime.genres?.slice(0, 3).map((g) => (
                        <Chip key={g.name} label={g.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    {watchlistIds.has(anime.mal_id) ? (
                      <Button size="small" disabled sx={{ color: 'grey.500' }}>
                        Already in Watchlist
                      </Button>
                    ) : (
                      <Button size="small" onClick={(e) => addToWatchlist(e, anime)}>
                        {isAuthenticated ? 'Add to Watchlist' : 'Login to Add'}
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination */}
        {results.length > 0 && !loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, mb: 4 }}>
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
            <Typography sx={{ alignSelf: 'center' }}>Page {page}</Typography>
            <Button
              variant="outlined"
              disabled={!hasNextPage}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Search;
