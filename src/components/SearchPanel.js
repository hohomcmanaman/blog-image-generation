import React, { useState } from 'react';

function SearchPanel({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    orientation: '',
    color: '',
    size: '',
    perPage: 20
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), filters);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="search-panel">
      <h2>Search Images</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="search-query">Keywords</label>
          <input
            id="search-query"
            type="text"
            className="search-input"
            placeholder="e.g., productivity tips, travel guide"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="filter-grid">
          <div className="form-group">
            <label htmlFor="orientation">Orientation</label>
            <select
              id="orientation"
              className="select w-full"
              value={filters.orientation}
              onChange={(e) => handleFilterChange('orientation', e.target.value)}
              disabled={loading}
            >
              <option value="">Any</option>
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
              <option value="square">Square</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <select
              id="color"
              className="select w-full"
              value={filters.color}
              onChange={(e) => handleFilterChange('color', e.target.value)}
              disabled={loading}
            >
              <option value="">Any</option>
              <option value="red">Red</option>
              <option value="orange">Orange</option>
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
              <option value="turquoise">Turquoise</option>
              <option value="blue">Blue</option>
              <option value="violet">Violet</option>
              <option value="pink">Pink</option>
              <option value="brown">Brown</option>
              <option value="black">Black</option>
              <option value="gray">Gray</option>
              <option value="white">White</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="size">Size</label>
          <select
            id="size"
            className="select w-full"
            value={filters.size}
            onChange={(e) => handleFilterChange('size', e.target.value)}
            disabled={loading}
          >
            <option value="">Any</option>
            <option value="large">Large (24MP+)</option>
            <option value="medium">Medium (12MP+)</option>
            <option value="small">Small (4MP+)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="per-page">Results per page</label>
          <select
            id="per-page"
            className="select w-full"
            value={filters.perPage}
            onChange={(e) => handleFilterChange('perPage', parseInt(e.target.value))}
            disabled={loading}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={80}>80</option>
          </select>
        </div>

        <button
          type="submit"
          className="search-button"
          disabled={loading || !query.trim()}
        >
          {loading ? (
            <>
              <div className="loading"></div>
              Searching...
            </>
          ) : (
            <>
              🔍 Search Images
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-sm text-muted">
        <p>💡 <strong>Tips:</strong></p>
        <ul style={{ marginLeft: '16px', marginTop: '8px' }}>
          <li>Use specific keywords for better results</li>
          <li>Try multiple search terms separated by spaces</li>
          <li>Filter by orientation for your blog layout</li>
        </ul>
      </div>
    </div>
  );
}

export default SearchPanel;