
import React, { useState, useEffect, useCallback } from 'react';
import { Gallery, Language, getLocalizedText } from '../types';
import { TRANSLATIONS } from '../translations';
import ImageLightbox from '../components/ImageLightbox';

interface GaleriasProps {
  galleries: Gallery[];
  lang: Language;
}

const Galerias: React.FC<GaleriasProps> = ({ galleries, lang }) => {
  const t = TRANSLATIONS[lang].galleries;
  const activeGalleries = galleries.filter(g => g.status === 'activa');

  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openGallery = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setActiveImageIndex(0);
  };

  const closeGallery = useCallback(() => {
    setSelectedGallery(null);
    setLightboxOpen(false);
  }, []);

  const prevImage = useCallback(() => {
    if (!selectedGallery) return;
    setActiveImageIndex(i => (i - 1 + selectedGallery.images.length) % selectedGallery.images.length);
  }, [selectedGallery]);

  const nextImage = useCallback(() => {
    if (!selectedGallery) return;
    setActiveImageIndex(i => (i + 1) % selectedGallery.images.length);
  }, [selectedGallery]);

  useEffect(() => {
    if (!selectedGallery) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedGallery, closeGallery, prevImage, nextImage]);

  const images = selectedGallery?.images ?? [];
  const currentImage = images[activeImageIndex] ?? '';
  const description = selectedGallery ? getLocalizedText(selectedGallery.description, lang) : '';

  return (
    <>
      <div className="pt-32 pb-24 min-h-screen bg-white animate-fadeIn">
        {/* Header */}
        <header className="max-w-7xl mx-auto px-6 mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-4">
            LOONA CONTEMPORARY
          </p>
          <h1 className="text-5xl md:text-6xl font-light text-zinc-900 mb-4">
            <em className="font-serif italic">{t.pageTitle}</em>
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">{t.pageSubtitle}</p>
          <div className="mt-8 w-16 h-px bg-zinc-200" />
        </header>

        {/* Gallery Grid */}
        <main className="max-w-7xl mx-auto px-6">
          {activeGalleries.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-zinc-400 text-sm uppercase tracking-widest">{t.noGalleries}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeGalleries.map(gallery => {
                const desc = getLocalizedText(gallery.description, lang);
                return (
                  <article
                    key={gallery.id}
                    className="group border border-zinc-100 bg-white hover:shadow-xl transition-all duration-500 cursor-pointer"
                    onClick={() => openGallery(gallery)}
                  >
                    {/* Cover image */}
                    <div className="aspect-[4/3] overflow-hidden bg-zinc-100 relative">
                      {gallery.images?.[0] ? (
                        <>
                          <img
                            src={gallery.images[0]}
                            alt={gallery.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                          />
                          {/* Explore overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                            <span className="text-white text-[10px] uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/50 px-4 py-2">
                              {t.explore}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Additional images strip */}
                    {gallery.images?.length > 1 && (
                      <div className="flex gap-1 px-3 pt-2 pb-0 overflow-x-auto">
                        {gallery.images.slice(1).map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`${gallery.name} ${idx + 2}`}
                            className="w-12 h-12 object-cover flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                          />
                        ))}
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <span className={`inline-block text-[9px] font-bold uppercase tracking-[0.3em] px-2 py-1 rounded-sm ${
                        gallery.type === 'propia'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {gallery.type === 'propia' ? t.typePropia : t.typeGestionada}
                      </span>
                      <h2 className="text-xl font-serif italic text-zinc-900">{gallery.name}</h2>
                      {gallery.city && (
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{gallery.city}</p>
                      )}
                      {gallery.address && (
                        <p className="text-xs text-zinc-400">{gallery.address}</p>
                      )}
                      {desc && (
                        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">{desc}</p>
                      )}
                      <div className="pt-2 border-t border-zinc-50">
                        <span className="text-[10px] uppercase tracking-widest text-emerald-600">
                          {t.explore} →
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ─── Gallery Detail Modal ─── */}
      {selectedGallery && (
        <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col animate-fadeIn">

          {/* Header bar */}
          <div className="flex-none flex items-center justify-between px-6 py-4 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
            <button
              onClick={closeGallery}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs uppercase tracking-widest"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              {t.backToGalleries}
            </button>
            <h2 className="text-white font-serif italic text-lg hidden sm:block">{selectedGallery.name}</h2>
            <button
              onClick={closeGallery}
              className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              aria-label={t.close}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main content: scrollable on mobile, side-by-side on desktop */}
          <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">

            {/* Image area — fixed height on mobile, fills column on desktop */}
            <div className="relative flex-none md:flex-1 h-[45vh] md:h-auto bg-zinc-950 flex flex-col md:min-h-0">
              {/* Main image */}
              <div className="flex-1 relative flex items-center justify-center overflow-hidden min-h-0">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={`${selectedGallery.name} ${activeImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain cursor-zoom-in select-none"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                    onClick={() => setLightboxOpen(true)}
                    draggable={false}
                  />
                ) : (
                  <div className="flex items-center justify-center text-zinc-600">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* Prev/Next arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                      aria-label="Anterior"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                      aria-label="Siguiente"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image counter + zoom hint */}
                {images.length > 0 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3">
                    <span className="text-white/50 text-xs tracking-widest">
                      {activeImageIndex + 1} {t.imageOf} {images.length}
                    </span>
                    {currentImage && (
                      <span className="text-white/30 text-[10px] hidden md:block">· clic para zoom</span>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex-none bg-zinc-900 border-t border-zinc-800 px-4 py-3">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`flex-shrink-0 w-14 h-14 overflow-hidden transition-all duration-200 ${
                          idx === activeImageIndex
                            ? 'ring-2 ring-white opacity-100'
                            : 'opacity-40 hover:opacity-70'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`${selectedGallery.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info sidebar */}
            <div className="flex-none md:w-80 lg:w-96 bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800 md:overflow-y-auto">
              <div className="p-8 space-y-6">
                {/* Type badge */}
                <span className={`inline-block text-[9px] font-bold uppercase tracking-[0.3em] px-2 py-1 rounded-sm ${
                  selectedGallery.type === 'propia'
                    ? 'bg-emerald-900/50 text-emerald-400'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {selectedGallery.type === 'propia' ? t.typePropia : t.typeGestionada}
                </span>

                {/* Name */}
                <div>
                  <h3 className="text-3xl font-serif italic text-white leading-tight">
                    {selectedGallery.name}
                  </h3>
                  {selectedGallery.city && (
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
                      {selectedGallery.city}
                    </p>
                  )}
                  {selectedGallery.address && (
                    <p className="text-xs text-zinc-500 mt-1">{selectedGallery.address}</p>
                  )}
                </div>

                {/* Description */}
                {description && (
                  <>
                    <div className="w-8 h-px bg-zinc-700" />
                    <p className="text-zinc-300 text-sm leading-relaxed">{description}</p>
                  </>
                )}

                {/* Contact */}
                {(selectedGallery.website || selectedGallery.email || selectedGallery.phone) && (
                  <>
                    <div className="w-8 h-px bg-zinc-700" />
                    <div className="space-y-3">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">{t.contact}</p>
                      {selectedGallery.website && (
                        <a
                          href={selectedGallery.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {t.visit}
                        </a>
                      )}
                      {selectedGallery.email && (
                        <a
                          href={`mailto:${selectedGallery.email}`}
                          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {selectedGallery.email}
                        </a>
                      )}
                      {selectedGallery.phone && (
                        <a
                          href={`tel:${selectedGallery.phone}`}
                          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {selectedGallery.phone}
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image zoom lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        imageUrl={currentImage}
        alt={selectedGallery ? `${selectedGallery.name} ${activeImageIndex + 1}` : ''}
        onClose={() => setLightboxOpen(false)}
        title={selectedGallery?.name}
      />
    </>
  );
};

export default Galerias;
