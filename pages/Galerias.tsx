
import React from 'react';
import { Gallery, Language, getLocalizedText } from '../types';
import { TRANSLATIONS } from '../translations';

interface GaleriasProps {
  galleries: Gallery[];
  lang: Language;
}

const Galerias: React.FC<GaleriasProps> = ({ galleries, lang }) => {
  const t = TRANSLATIONS[lang].galleries;
  const activeGalleries = galleries.filter(g => g.status === 'activa');

  return (
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
              const description = getLocalizedText(gallery.description, lang);
              return (
                <article
                  key={gallery.id}
                  className="group border border-zinc-100 bg-white hover:shadow-xl transition-all duration-500"
                >
                  {/* Cover image */}
                  <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
                    {gallery.images?.[0] ? (
                      <img
                        src={gallery.images[0]}
                        alt={gallery.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      />
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
                    {/* Type badge */}
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

                    {description && (
                      <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">{description}</p>
                    )}

                    {/* Contact info */}
                    <div className="pt-2 space-y-1 border-t border-zinc-50">
                      {gallery.website && (
                        <a
                          href={gallery.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {t.visit}
                        </a>
                      )}
                      {gallery.email && (
                        <p className="text-[10px] text-zinc-400">{gallery.email}</p>
                      )}
                      {gallery.phone && (
                        <p className="text-[10px] text-zinc-400">{gallery.phone}</p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Galerias;
