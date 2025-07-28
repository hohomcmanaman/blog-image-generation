import React from 'react';

function ImageGallery({ images, onImageSelect, loading }) {
  if (loading) {
    return (
      <div className="image-gallery">
        <div className="loading-state">
          <div className="loading" style={{ width: '40px', height: '40px' }}></div>
          <p>Searching for images...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="image-gallery">
        <div className="empty-state">
          <h3>No images found</h3>
          <p>Try searching with different keywords or adjust your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <div className="mb-4">
        <h3>Found {images.length} images</h3>
        <p className="text-sm text-muted">Click on an image to edit and customize it</p>
      </div>
      
      <div className="gallery-grid">
        {images.map((image) => (
          <div
            key={image.id}
            className="image-card fade-in"
            onClick={() => onImageSelect(image)}
          >
            <img
              src={image.src.medium}
              alt={image.alt || 'Pexels image'}
              loading="lazy"
            />
            <div className="image-info">
              <div className="image-photographer">
                📷 by {image.photographer}
              </div>
              <div className="image-dimensions">
                {image.width} × {image.height}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;