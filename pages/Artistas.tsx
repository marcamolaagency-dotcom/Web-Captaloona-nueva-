
import React, { useState, useMemo } from 'react';
import { Artwork, Artist, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import ImageLightbox from '../components/ImageLightbox';

interface ArtistasProps {
  artists: Artist[];
  artworks: Artwork[];
  lang: Language;
}

const Artistas: React.FC<ArtistasProps> = ({ artists, artworks, lang }) => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{url: string; title: string; artist: string} | null>(null);

  const t = TRANSLATIONS[lang].collection;

  // Build complete artist list from both props and artworks
  const allArtists = useMemo(() => {
    const artistMap = new Map<string, Artist>();
    artists.forEach(artist => artistMap.set(artist.id, artist));
    artworks.forEach(art => {
      if (!artistMap.has(art.artistId)) {
        artistMap.set(art.artistId, {
          id: art.artistId,
          name: art.artistName,
          bio: '',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
          location: ''
        });
      }
    });
    const list = Array.from(artistMap.values());
    // Claudio always last — give prominence to represented artists
    const isClaudio = (a: Artist) => a.id === 'claudio-fiorentini' || a.name.toLowerCase().includes('claudio');
    return [...list.filter(a => !isClaudio(a)), ...list.filter(isClaudio)];
  }, [artists, artworks]);

  const worksCount = (artistId: string) =>
    artworks.filter(a => a.artistId === artistId || a.artistName.toLowerCase() === allArtists.find(x => x.id === artistId)?.name.toLowerCase()).length;

  // View: Single Artist Profile + Works
  if (selectedArtist) {
    const artistWorks = artworks.filter(a =>
      a.artistId === selectedArtist.id ||
      a.artistName.toLowerCase() === selectedArtist.name.toLowerCase()
    );

    return (
      <div className="pt-24 md:pt-32 pb-16 md:pb-24 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Back button - visible above the card on mobile */}
          <button
            onClick={() => setSelectedArtist(null)}
            className="mb-6 text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-700 transition-colors"
          >
            ← {t.backToCatalog}
          </button>

          {/* Artist Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center mb-12 md:mb-20 bg-zinc-50 p-6 md:p-12 rounded-sm border border-zinc-100">
            <div className="relative">
              {/* Decorative frame — hidden on small screens to avoid overflow */}
              <div className="hidden md:block absolute -top-6 -left-6 w-full h-full border-2 border-emerald-100"></div>
              <img
                src={selectedArtist.imageUrl}
                alt={selectedArtist.name}
                className="relative z-10 w-full aspect-square object-cover shadow-xl md:shadow-2xl"
              />
            </div>
            <div className="space-y-4 md:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-6xl serif">{selectedArtist.name}</h1>
              {selectedArtist.location && (
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{selectedArtist.location}</p>
              )}
              {selectedArtist.bio && (
                <p className="text-zinc-500 leading-relaxed text-base md:text-lg">{selectedArtist.bio}</p>
              )}
              <div className="flex gap-10 pt-4 border-t border-zinc-100">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">{t.artworkCollection}</h4>
                  <p className="text-sm">{artistWorks.length} {t.works}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Artist Works */}
          {artistWorks.length > 0 && (
            <>
              <h2 className="text-2xl md:text-3xl serif mb-8 md:mb-12 border-b pb-5 md:pb-6">{t.catalogOf} {selectedArtist.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-10 md:gap-y-20">
                {artistWorks.map((art) => (
                  <div key={art.id} className="group">
                    <div
                      className="relative aspect-[3/4] mb-5 md:mb-8 overflow-hidden bg-zinc-100 cursor-zoom-in"
                      onClick={() => setLightboxImage({url: art.imageUrl, title: art.title, artist: art.artistName})}
                    >
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${art.status === 'vendido' ? 'opacity-60 grayscale-[0.5]' : ''}`}
                      />
                      <div className="absolute top-3 right-3 md:top-4 md:right-4 flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm ${art.status === 'disponible' ? 'bg-white text-emerald-600' : 'bg-zinc-900 text-white opacity-90'}`}>
                          {art.status === 'disponible' ? `${art.price}€` : t.sold}
                        </span>
                        {(art.style || art.category) && (
                          <span className="bg-white/80 px-3 py-1 text-[8px] uppercase tracking-tighter text-zinc-500 backdrop-blur-md">
                            {art.style || art.category}
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-medium text-zinc-700 shadow-lg">
                          Click para ampliar
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl md:text-2xl serif group-hover:text-emerald-600 transition-colors">{art.title}</h3>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest pt-3 border-t border-zinc-50 mt-4">
                        {art.medium} • {art.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <ImageLightbox
          isOpen={!!lightboxImage}
          imageUrl={lightboxImage?.url || ''}
          alt={lightboxImage?.title || ''}
          title={lightboxImage?.title}
          artist={lightboxImage?.artist}
          onClose={() => setLightboxImage(null)}
        />
      </div>
    );
  }

  // View: Artists Grid
  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <header className="mb-12 md:mb-20 text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-4 block">LOONA CONTEMPORARY</span>
          <h1 className="text-4xl md:text-5xl serif mb-4 md:mb-6">
            {lang === 'ES' ? 'Artistas' : lang === 'EN' ? 'Artists' : lang === 'FR' ? 'Artistes' : 'Artisti'}
          </h1>
          <p className="text-sm md:text-base text-zinc-500 leading-relaxed px-2 md:px-0">
            {lang === 'ES'
              ? 'Los creadores que representamos comparten una visión profunda del arte como herramienta de transformación. Cada artista trabaja desde su más auténtica voz interior.'
              : lang === 'EN'
              ? 'The creators we represent share a deep vision of art as a tool for transformation. Each artist works from their most authentic inner voice.'
              : lang === 'FR'
              ? "Les créateurs que nous représentons partagent une vision profonde de l'art comme outil de transformation. Chaque artiste travaille depuis sa voix intérieure la plus authentique."
              : "I creatori che rappresentiamo condividono una visione profonda dell'arte come strumento di trasformazione. Ogni artista lavora dalla sua voce interiore più autentica."}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {allArtists.map((artist) => {
            const count = worksCount(artist.id);
            return (
              <button
                key={artist.id}
                onClick={() => setSelectedArtist(artist)}
                className="group text-left bg-zinc-50 hover:bg-white border border-zinc-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-500 rounded-sm overflow-hidden"
              >
                {/* Artist Image */}
                <div className="aspect-[4/3] overflow-hidden bg-zinc-200 relative">
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {count > 0 && (
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">{count} {t.works}</span>
                    </div>
                  )}
                </div>

                {/* Artist Info */}
                <div className="p-5 md:p-8">
                  <h2 className="text-xl md:text-2xl serif mb-1 md:mb-2 group-hover:text-emerald-600 transition-colors">{artist.name}</h2>
                  {artist.location && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 md:mb-4">{artist.location}</p>
                  )}
                  {artist.bio && (
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">{artist.bio}</p>
                  )}
                  <div className="mt-4 md:mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                      {lang === 'ES' ? 'Ver obras' : lang === 'EN' ? 'View works' : lang === 'FR' ? 'Voir les œuvres' : 'Vedi opere'} →
                    </span>
                    {count > 0 && (
                      <span className="text-[10px] text-zinc-400">{count} {t.works}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {allArtists.length === 0 && (
          <div className="text-center py-16 md:py-24">
            <p className="text-zinc-400">
              {lang === 'ES' ? 'No hay artistas disponibles aún.' : lang === 'EN' ? 'No artists available yet.' : lang === 'FR' ? "Pas encore d'artistes disponibles." : 'Nessun artista disponibile ancora.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Artistas;
