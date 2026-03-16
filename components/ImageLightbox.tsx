
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

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
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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

  // Wheel no-pasivo: evita que el scroll del fondo se active al hacer zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOpen) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      // Cursor relativo al centro del contenedor
      const cx = e.clientX - (rect.left + rect.width / 2);
      const cy = e.clientY - (rect.top + rect.height / 2);
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      setScale(prev => {
        const next = Math.min(Math.max(prev + delta, 1), 5);
        if (next <= 1) {
          setPosition({ x: 0, y: 0 });
        } else {
          // Zoom anclado al cursor
          setPosition(pos => clampDrag(
            pos.x - cx * (next / prev - 1),
            pos.y - cy * (next / prev - 1),
            next
          ));
        }
        return next;
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isOpen]);

  const clampDrag = (x: number, y: number, currentScale: number) => {
    const maxX = (window.innerWidth / 2) * (currentScale - 1);
    const maxY = (window.innerHeight / 2) * (currentScale - 1);
    return {
      x: Math.min(Math.max(x, -maxX), maxX),
      y: Math.min(Math.max(y, -maxY), maxY),
    };
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.5, 5));

  const zoomOut = () => {
    setScale(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const raw = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
      setPosition(clampDrag(raw.x, raw.y, scale));
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const getTouchDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setLastTouchDistance(getTouchDistance(e.touches));
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      const delta = (currentDistance - lastTouchDistance) * 0.01;
      setScale(prev => {
        const next = Math.min(Math.max(prev + delta, 1), 5);
        setLastTouchDistance(currentDistance);
        if (next <= 1) {
          setPosition({ x: 0, y: 0 });
        } else {
          setPosition(pos => clampDrag(pos.x, pos.y, next));
        }
        return next;
      });
    } else if (isDragging && e.touches.length === 1 && scale > 1) {
      const raw = { x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y };
      setPosition(clampDrag(raw.x, raw.y, scale));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouchDistance(null);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale === 1) setScale(2.5);
    else resetZoom();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    // z-[200] ensures the lightbox is always above the navbar (z-50) and any other fixed UI
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black/95 animate-fadeInOpacity flex items-center justify-center"
      style={{
        paddingTop: '72px',
        paddingBottom: '80px',
        cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-white bg-black/50 hover:bg-black/70 rounded-full shadow-lg transition-colors"
        aria-label="Cerrar"
      >
        <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Zoom controls */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 md:gap-3 bg-black/60 backdrop-blur-sm px-4 md:px-5 py-3 rounded-full shadow-lg">
        <button
          onClick={(e) => { e.stopPropagation(); zoomOut(); }}
          disabled={scale <= 1}
          className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-white/80 hover:text-white disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
          aria-label="Reducir zoom"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); resetZoom(); }}
          className="px-3 py-1 text-white/80 hover:text-white text-sm font-medium transition-colors min-w-[60px]"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); zoomIn(); }}
          disabled={scale >= 5}
          className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-white/80 hover:text-white disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
          aria-label="Aumentar zoom"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Title / artist info */}
      {(title || artist) && (
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 text-white max-w-[60%] md:max-w-sm">
          {title && <h3 className="text-base md:text-xl serif line-clamp-2">{title}</h3>}
          {artist && <p className="text-xs md:text-sm text-white/70 italic">{artist}</p>}
        </div>
      )}

      {/* Desktop hint */}
      <div className="hidden md:block absolute top-6 left-1/2 -translate-x-1/2 z-10 text-white/50 text-xs tracking-wide pointer-events-none">
        Doble clic o scroll para zoom · Arrastra para mover
      </div>

      {/* Mobile hint */}
      <div className="md:hidden absolute bottom-[76px] left-1/2 -translate-x-1/2 z-10 text-white/40 text-[10px] tracking-wide text-center px-4 whitespace-nowrap pointer-events-none">
        Pellizca para zoom · Doble tap para ampliar
      </div>

      {/* Image — direct flex child so items-center/justify-center lo centra correctamente */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt={alt}
        className="max-w-[92vw] md:max-w-[82vw] select-none"
        style={{
          maxHeight: 'calc(100vh - 152px)',
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          willChange: 'transform',
          transition: isDragging ? 'none' : 'transform 0.15s ease',
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
        }}
        draggable={false}
      />
    </div>,
    document.body
  );
};

export default ImageLightbox;
