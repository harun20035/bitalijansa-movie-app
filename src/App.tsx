import React, { useState } from 'react';
import './App.css';

type TabType = 'movies' | 'tv-shows';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tv-shows');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

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
          />
        </div>
      </div>

      <main className="content">
        <div className="grid">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="grid-item">
              <div className="placeholder-image">
                <div className="cross">✕</div>
              </div>
              <div className="item-title">
                {activeTab === 'movies' ? 'Movie Title' : 'TV Title'}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
