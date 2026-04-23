
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface VideoPlayerProps {
  isOpen: boolean;
  videoUrl: string;
  title?: string;
  artist?: string;
  onClose: () => void;
}

type VideoInfo =
  | { type: 'youtube'; embedUrl: string }
  | { type: 'vimeo'; embedUrl: string }
  | { type: 'direct'; embedUrl: string }
  | null;

function parseVideoUrl(url: string): VideoInfo {
  if (!url) return null;

  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (ytMatch) return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0` };

  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1` };

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { type: 'direct', embedUrl: url };

  // Unknown URL — try to embed as iframe anyway
  return { type: 'youtube', embedUrl: url };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ isOpen, videoUrl, title, artist, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const video = parseVideoUrl(videoUrl);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[150] bg-black/97 flex flex-col items-center justify-center animate-fadeInOpacity"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-12 h-12 flex items-center justify-center text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Cerrar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Title / artist */}
      {(title || artist) && (
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 text-white max-w-[60%]">
          {title && <h3 className="text-base md:text-lg font-serif italic line-clamp-1">{title}</h3>}
          {artist && <p className="text-xs text-white/60 mt-0.5">{artist}</p>}
        </div>
      )}

      {/* Video container */}
      <div className="w-full max-w-5xl px-4 md:px-8" style={{ aspectRatio: '16/9' }}>
        {video?.type === 'direct' ? (
          <video
            src={video.embedUrl}
            controls
            autoPlay
            className="w-full h-full bg-black"
          />
        ) : video ? (
          <iframe
            src={video.embedUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title || 'Video'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">
            URL de video no reconocida
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default VideoPlayer;
