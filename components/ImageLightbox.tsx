
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string;
  alt: string;
  onClose: () => void;
  title?: string;
  artist?: string;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  imageUrl,
  alt,
  onClose,
  title,
  artist
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset zoom when modal opens/closes or image changes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Zoom with mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale(prev => Math.min(Math.max(prev + delta, 1), 5));

    // Reset position if zooming out to 1
    if (scale + delta <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  // Zoom buttons
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 5));
  };

  const zoomOut = () => {
    const newScale = Math.max(scale - 0.5, 1);
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Drag functionality for panning when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Calculate distance between two touch points
  const getTouchDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom start
      setLastTouchDistance(getTouchDistance(e.touches));
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan start
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      // Pinch zoom
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      const delta = (currentDistance - lastTouchDistance) * 0.01;
      setScale(prev => Math.min(Math.max(prev + delta, 1), 5));
      setLastTouchDistance(currentDistance);

      if (scale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (isDragging && e.touches.length === 1 && scale > 1) {
      // Pan
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouchDistance(null);
  };

  // Double click/tap to zoom
  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2.5);
    } else {
      resetZoom();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-white/80 hover:text-white transition-colors bg-black/30 hover:bg-black/50 rounded-full"
        aria-label="Cerrar"
      >
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Zoom controls */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 md:gap-3 bg-black/50 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
        <button
          onClick={zoomOut}
          disabled={scale <= 1}
          className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-white/80 hover:text-white disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
          aria-label="Reducir zoom"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
        </button>

        <button
          onClick={resetZoom}
          className="px-3 py-1 text-white/80 hover:text-white text-sm font-medium transition-colors min-w-[60px]"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          onClick={zoomIn}
          disabled={scale >= 5}
          className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-white/80 hover:text-white disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
          aria-label="Aumentar zoom"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Image info - hidden on small mobile */}
      {(title || artist) && (
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50 text-white max-w-[60%] md:max-w-none">
          {title && <h3 className="text-base md:text-xl serif line-clamp-2">{title}</h3>}
          {artist && <p className="text-xs md:text-sm text-white/70 italic">{artist}</p>}
        </div>
      )}

      {/* Zoom hint - hidden on mobile */}
      <div className="hidden md:block absolute top-6 left-1/2 -translate-x-1/2 z-50 text-white/50 text-xs tracking-wide">
        Doble clic o scroll para zoom - Arrastra para mover
      </div>

      {/* Mobile hint */}
      <div className="md:hidden absolute top-16 left-1/2 -translate-x-1/2 z-50 text-white/50 text-[10px] tracking-wide text-center">
        Pellizca para zoom - Doble tap para ampliar
      </div>

      {/* Image container */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center overflow-hidden touch-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt={alt}
          className="max-w-[95vw] md:max-w-[90vw] max-h-[80vh] md:max-h-[85vh] object-contain select-none transition-transform duration-100"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          }}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default ImageLightbox;
