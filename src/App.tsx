import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { useMovieStore } from './store/movieStore';
import { useDebounce } from './hooks/useDebounce';
import MovieCard from './components/MovieCard';
import { Movie, TVShow } from './types';
import { movieAPI, tvAPI } from './services/api';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeTab,
    searchQuery,
    searchResults,
    topRatedMovies,
    topRatedTVShows,
    isLoading,
    isSearching,
    setActiveTab,
    setSearchQuery,
    setSearchResults,
    setTopRatedMovies,
    setTopRatedTVShows,
    setIsLoading,
    setIsSearching,
    clearSearch,
    navigateToDetail,
  } = useMovieStore();

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  // Fetch top rated content when tab changes
  const fetchTopRated = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'movies') {
        const topMovies = await movieAPI.getTopRated();
        setTopRatedMovies(topMovies);
      } else {
        const topTVShows = await tvAPI.getTopRated();
        setTopRatedTVShows(topTVShows);
      }
    } catch (error) {
      console.error('Error fetching top rated content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search content
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

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearchQuery.length >= 3) {
      searchContent(debouncedSearchQuery);
    } else {
      clearSearch();
    }
  }, [debouncedSearchQuery, activeTab]);

  // Fetch top rated content when tab changes
  useEffect(() => {
    fetchTopRated();
  }, [activeTab]);

  const handleTabChange = (tab: 'movies' | 'tv-shows') => {
    setActiveTab(tab);
    // If we're searching, trigger search for the new tab
    if (searchQuery.length >= 3) {
      searchContent(searchQuery);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleItemClick = (item: Movie | TVShow) => {
    navigateToDetail();
    const type = 'title' in item ? 'movie' : 'tv';
    navigate(`/${type}/${item.id}`);
  };

  // Determine what to display
  const displayItems = searchQuery.length >= 3 ? searchResults : (activeTab === 'movies' ? topRatedMovies : topRatedTVShows);
  const isShowingSearchResults = searchQuery.length >= 3;

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">🎬 MovieHub</h1>
      </header>
      
      <nav className="tabs">
        <button 
          className={`tab ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => handleTabChange('movies')}
        >
          Movies
        </button>
        <button 
          className={`tab ${activeTab === 'tv-shows' ? 'active' : ''}`}
          onClick={() => handleTabChange('tv-shows')}
        >
          TV Shows
        </button>
      </nav>

      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon-small">🔍</span>
          <input 
            type="text" 
            placeholder="Search" 
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {isSearching && <div className="search-loading">Searching...</div>}
      </div>

      <main className="content">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {isShowingSearchResults && (
              <div className="search-results-header">
                <h2>Search Results for "{searchQuery}"</h2>
                <p>Found {displayItems.length} results</p>
              </div>
            )}
            
            {!isShowingSearchResults && (
              <div className="top-rated-header">
                <h2>Top 10 {activeTab === 'movies' ? 'Movies' : 'TV Shows'}</h2>
              </div>
            )}

            <div className="grid">
              {displayItems.length > 0 ? (
                displayItems.map((item) => (
                  <MovieCard
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(item)}
                  />
                ))
              ) : (
                <div className="no-results">
                  {isShowingSearchResults 
                    ? `No results found for "${searchQuery}"`
                    : `No ${activeTab === 'movies' ? 'movies' : 'TV shows'} available`
                  }
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

function App() {
  return <AppContent />;
}

export default App;
