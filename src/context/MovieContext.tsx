import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, TVShow, TabType } from '../types';
import { movieAPI, tvAPI } from '../services/api';

interface MovieContextType {
  // State
  activeTab: TabType;
  movies: Movie[];
  tvShows: TVShow[];
  searchQuery: string;
  searchResults: Movie[] | TVShow[];
  isLoading: boolean;
  isSearching: boolean;
  
  // Actions
  setActiveTab: (tab: TabType) => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  fetchTopRated: () => Promise<void>;
  searchContent: (query: string) => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('tv-shows');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Movie[] | TVShow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const fetchTopRated = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'movies') {
        const topMovies = await movieAPI.getTopRated();
        setMovies(topMovies);
      } else {
        const topTVShows = await tvAPI.getTopRated();
        setTvShows(topTVShows);
      }
    } catch (error) {
      console.error('Error fetching top rated content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchContent = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      if (activeTab === 'movies') {
        const results = await movieAPI.searchMovies(query);
        setSearchResults(results);
      } else {
        const results = await tvAPI.searchTVShows(query);
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error searching content:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // Fetch top rated content when tab changes
  useEffect(() => {
    fetchTopRated();
  }, [activeTab]);

  const value: MovieContextType = {
    activeTab,
    movies,
    tvShows,
    searchQuery,
    searchResults,
    isLoading,
    isSearching,
    setActiveTab,
    setSearchQuery,
    clearSearch,
    fetchTopRated,
    searchContent,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};
