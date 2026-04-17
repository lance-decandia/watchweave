export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  synopsis: string;
  episodes: number;
  score: number;
  genres: { name: string }[];
  status: string;
}

export interface WatchlistEntry {
  id: number;
  anime_id: number;
  anime_title: string;
  anime_image: string;
  status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped';
  episodes_watched: number;
  total_episodes: number;
  updated_at: string;
}
