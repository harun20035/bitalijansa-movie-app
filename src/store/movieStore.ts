import { create } from 'zustand';
import { Movie, TVShow, TabType } from '../types';

interface MovieStore {
  // Navigation state
  previousPage: 'home' | 'detail';
  previousTab: TabType;
  previousSearchQuery: string;
  previousSearchResults: Movie[] | TVShow[];
  previousTopRatedMovies: Movie[];
  previousTopRatedTVShows: TVShow[];
  
  // Current state
  activeTab: TabType;
  searchQuery: string;
  searchResults: Movie[] | TVShow[];
  topRatedMovies: Movie[];
  topRatedTVShows: TVShow[];
  isLoading: boolean;
  isSearching: boolean;
  
  // Actions
  setActiveTab: (tab: TabType) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Movie[] | TVShow[]) => void;
  setTopRatedMovies: (movies: Movie[]) => void;
  setTopRatedTVShows: (tvShows: TVShow[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSearching: (searching: boolean) => void;
  
  // Navigation actions
  navigateToDetail: () => void;
  navigateBack: () => void;
  clearSearch: () => void;
}

export const useMovieStore = create<MovieStore>((set, get) => ({
  // Initial state
  previousPage: 'home',
  previousTab: 'tv-shows',
  previousSearchQuery: '',
  previousSearchResults: [],
  previousTopRatedMovies: [],
  previousTopRatedTVShows: [],
  
  activeTab: 'tv-shows',
  searchQuery: '',
  searchResults: [],
  topRatedMovies: [],
  topRatedTVShows: [],
  isLoading: false,
  isSearching: false,
  
  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setTopRatedMovies: (movies) => set({ topRatedMovies: movies }),
  setTopRatedTVShows: (tvShows) => set({ topRatedTVShows: tvShows }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsSearching: (searching) => set({ isSearching: searching }),
  
  // Navigation actions
  navigateToDetail: () => {
    const state = get();
    set({
      previousPage: 'home',
      previousTab: state.activeTab,
      previousSearchQuery: state.searchQuery,
      previousSearchResults: state.searchResults,
      previousTopRatedMovies: state.topRatedMovies,
      previousTopRatedTVShows: state.topRatedTVShows,
    });
  },
  
  navigateBack: () => {
    const state = get();
    set({
      activeTab: state.previousTab,
      searchQuery: state.previousSearchQuery,
      searchResults: state.previousSearchResults,
      topRatedMovies: state.previousTopRatedMovies,
      topRatedTVShows: state.previousTopRatedTVShows,
      previousPage: 'home',
    });
  },
  
  clearSearch: () => set({ 
    searchQuery: '', 
    searchResults: [],
    isSearching: false 
  }),
}));
