import axios from 'axios';
import { Movie, TVShow, TMDBResponse } from '../types';

const API_KEY = 'd87bacc36f7b42f616ab04b923028dd6';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const tvAPI = {
  // Get top rated TV shows
  getTopRated: async (): Promise<TVShow[]> => {
    try {
      const response = await api.get<TMDBResponse<TVShow>>('/tv/top_rated');
      return response.data.results.slice(0, 10); // Return only top 10
    } catch (error) {
      console.error('Error fetching top rated TV shows:', error);
      throw error;
    }
  },

  // Search TV shows
  searchTVShows: async (query: string): Promise<TVShow[]> => {
    try {
      const response = await api.get<TMDBResponse<TVShow>>('/search/tv', {
        params: { query },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error searching TV shows:', error);
      throw error;
    }
  },

  // Get TV show details
  getTVShowDetails: async (id: number): Promise<TVShow> => {
    try {
      const response = await api.get<TVShow>(`/tv/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  },
};

export const movieAPI = {
  // Get top rated movies
  getTopRated: async (): Promise<Movie[]> => {
    try {
      const response = await api.get<TMDBResponse<Movie>>('/movie/top_rated');
      return response.data.results.slice(0, 10); // Return only top 10
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query: string): Promise<Movie[]> => {
    try {
      const response = await api.get<TMDBResponse<Movie>>('/search/movie', {
        params: { query },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (id: number): Promise<Movie> => {
    try {
      const response = await api.get<Movie>(`/movie/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },
};
