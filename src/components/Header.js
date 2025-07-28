import React from 'react';

function Header({ theme, onThemeToggle, currentView, onBackToSearch }) {
  return (
    <header className="header">
      <div className="header-left">
        {currentView === 'edit' && (
          <button className="back-button" onClick={onBackToSearch}>
            ← Back to Search
          </button>
        )}
        <h1 className="header-title">Blog Image Generator</h1>
      </div>
      
      <div className="header-right">
        <button 
          className="theme-toggle" 
          onClick={onThemeToggle}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}

export default Header;