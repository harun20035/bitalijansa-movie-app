import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Movie, TVShow } from '../types';
import { movieAPI, tvAPI } from '../services/api';
import { useMovieStore } from '../store/movieStore';
import './MovieDetail.css';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { navigateBack } = useMovieStore();
  
  // Determine type from current URL
  const type = window.location.pathname.includes('/movie/') ? 'movie' : 'tv';
  
  const [item, setItem] = useState<Movie | TVShow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || !type) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        let details: Movie | TVShow;
        
        if (type === 'movie') {
          details = await movieAPI.getMovieDetails(parseInt(id));
        } else {
          details = await tvAPI.getTVShowDetails(parseInt(id));
        }
        
        setItem(details);
      } catch (err) {
        setError('Failed to load details');
        console.error('Error fetching details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, type]);

  const handleBackClick = () => {
    navigateBack();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="detail-page">
        <div className="loading">Loading details...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="detail-page">
        <div className="error">
          <h2>Error</h2>
          <p>{error || 'Item not found'}</p>
          <button onClick={handleBackClick} className="back-button">
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const isMovie = 'title' in item;
  const title = isMovie ? item.title : item.name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  // Prioritize backdrop_path for better hero images, fallback to poster_path
  const imageUrl = item.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1920${item.backdrop_path}`
    : item.poster_path 
    ? `https://image.tmdb.org/t/p/w780${item.poster_path}`
    : null;
    
  // Determine if we're using a poster (square) or backdrop (wide) image
  const isPosterImage = !item.backdrop_path && item.poster_path;

  return (
    <div className="detail-page">
      <button onClick={handleBackClick} className="back-button">
        ← Back to {isMovie ? 'Movies' : 'TV Shows'}
      </button>
      
      <div className="detail-hero">
        <div className={`hero-image ${isPosterImage ? 'poster-image' : ''} ${!imageUrl ? 'no-image' : ''}`}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-movie.jpg';
              }}
            />
          ) : (
            <div className="placeholder-content">
              <div className="placeholder-icon">🎬</div>
              <h2 className="placeholder-title">{title}</h2>
            </div>
          )}
          <div className="hero-overlay">
            <h1 className="hero-title">{title}</h1>
            <div className="hero-meta">
              <span className="year">{year}</span>
              <span className="rating">⭐ {item.vote_average.toFixed(1)}</span>
              <span className="votes">({item.vote_count} votes)</span>
            </div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="detail-overview">
            <h3>Overview</h3>
            <p>{item.overview || 'No overview available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
