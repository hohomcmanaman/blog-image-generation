import React, { useState, useEffect } from 'react';
import SearchPanel from './components/SearchPanel';
import ImageGallery from './components/ImageGallery';
import ImageEditor from './components/ImageEditor';
import Header from './components/Header';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('search'); // 'search', 'edit'

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSearch = async (query, filters) => {
    setLoading(true);
    try {
      // Check if we're in Electron or web environment
      if (window.electronAPI) {
        const result = await window.electronAPI.searchImages(query, filters);
        if (result.success) {
          setSearchResults(result.images);
        } else {
          console.error('Search error:', result.error);
          alert('Error searching images: ' + result.error);
        }
      } else {
        // Web environment - use fetch API
        const response = await fetch('/api/search-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, filters })
        });
        const result = await response.json();
        
        if (result.success) {
          setSearchResults(result.images);
        } else {
          console.error('Search error:', result.error);
          alert('Error searching images: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching images: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setCurrentView('edit');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedImage(null);
  };

  return (
    <div className="app">
      <Header 
        theme={theme} 
        onThemeToggle={toggleTheme}
        currentView={currentView}
        onBackToSearch={handleBackToSearch}
      />
      
      <main className="main-content">
        {currentView === 'search' ? (
          <div className="search-view">
            <SearchPanel onSearch={handleSearch} loading={loading} />
            <ImageGallery 
              images={searchResults} 
              onImageSelect={handleImageSelect}
              loading={loading}
            />
          </div>
        ) : (
          <ImageEditor 
            image={selectedImage}
            onBack={handleBackToSearch}
          />
        )}
      </main>
    </div>
  );
}

export default App;