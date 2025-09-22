import React from 'react';
import { Movie, TVShow } from '../types';

interface MovieCardProps {
  item: Movie | TVShow;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, onClick }) => {
  const isMovie = 'title' in item;
  const title = isMovie ? item.title : item.name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  const imageUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : '/placeholder-movie.jpg';

  return (
    <div className="grid-item" onClick={onClick}>
      <div className="movie-poster">
        <img 
          src={imageUrl} 
          alt={title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-movie.jpg';
          }}
        />
      </div>
      <div className="item-title">
        <h3>{title}</h3>
        <p className="year">{year}</p>
        <p className="rating">⭐ {item.vote_average.toFixed(1)}</p>
      </div>
    </div>
  );
};

export default MovieCard;
