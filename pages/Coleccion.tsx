
import React, { useState, useMemo } from 'react';
import { Artwork, Artist, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import ImageLightbox from '../components/ImageLightbox';

interface ColeccionProps {
  artworks: Artwork[];
  artists?: Artist[];
  lang: Language;
}

const Coleccion: React.FC<ColeccionProps> = ({ artworks, artists = [], lang }) => {
  const [selectedArtistProfile, setSelectedArtistProfile] = useState<Artist | null>(null);
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
    return Array.from(artistMap.values());
  }, [artworks, artists]);

  // Only permanent works
  const permanentWorks = artworks.filter(art => art.isPermanent === true);

  const findArtist = (artistId: string, artistName: string): Artist | null => {
    let artist = allArtists.find(a => a.id === artistId);
    if (!artist) artist = allArtists.find(a => a.name.toLowerCase() === artistName.toLowerCase());
    if (!artist && artistName) {
      artist = {
        id: artistId,
        name: artistName,
        bio: '',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        location: ''
      };
    }
    return artist || null;
  };

  // View: Artist Profile
  if (selectedArtistProfile) {
    const artistWorks = artworks.filter(a =>
      a.artistId === selectedArtistProfile.id ||
      a.artistName.toLowerCase() === selectedArtistProfile.name.toLowerCase()
    );

    return (
      <div className="pt-24 md:pt-32 pb-16 md:pb-24 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          <button
            onClick={() => setSelectedArtistProfile(null)}
            className="mb-6 text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-700 transition-colors"
          >
            ← {t.backToCatalog}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center mb-12 md:mb-20 bg-zinc-50 p-6 md:p-12 rounded-sm border border-zinc-100">
            <div className="relative">
              <div className="hidden md:block absolute -top-6 -left-6 w-full h-full border-2 border-emerald-100"></div>
              <img src={selectedArtistProfile.imageUrl} alt={selectedArtistProfile.name} className="relative z-10 w-full aspect-square object-cover shadow-xl md:shadow-2xl" />
            </div>
            <div className="space-y-4 md:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-6xl serif">{selectedArtistProfile.name}</h1>
              {selectedArtistProfile.bio && (
                <p className="text-zinc-500 leading-relaxed text-base md:text-lg">{selectedArtistProfile.bio}</p>
              )}
              <div className="flex gap-10 pt-4 border-t border-zinc-100">
                {selectedArtistProfile.location && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">{t.location}</h4>
                    <p className="text-sm">{selectedArtistProfile.location}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">{t.artworkCollection}</h4>
                  <p className="text-sm">{artistWorks.length} {t.works}</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl serif mb-8 md:mb-12 border-b pb-5 md:pb-6">{t.catalogOf} {selectedArtistProfile.name}</h2>
          <ArtGrid
            artworks={artistWorks}
            onArtistClick={setSelectedArtistProfile}
            findArtist={findArtist}
            t={t}
            onImageClick={(url, title, artist) => setLightboxImage({url, title, artist})}
          />
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

  // View: Main Collection (permanent works only)
  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <header className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-4 block">LOONA CONTEMPORARY</span>
          <h1 className="text-4xl md:text-5xl serif mb-4 md:mb-6">{t.title}</h1>
          <p className="text-sm md:text-base text-zinc-500 leading-relaxed">
            {t.description}
          </p>
        </header>

        {/* Results count */}
        <div className="mb-8 md:mb-12 text-center">
          <p className="text-xs text-zinc-400 uppercase tracking-widest">
            {permanentWorks.length} {permanentWorks.length === 1 ? t.workFound : t.worksFound}
          </p>
        </div>

        {/* Art Grid */}
        {permanentWorks.length > 0 ? (
          <ArtGrid
            artworks={permanentWorks}
            onArtistClick={setSelectedArtistProfile}
            findArtist={findArtist}
            t={t}
            onImageClick={(url, title, artist) => setLightboxImage({url, title, artist})}
          />
        ) : (
          <div className="text-center py-16 md:py-24">
            <p className="text-zinc-400">{t.noWorksFound}</p>
          </div>
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
};

interface ArtGridProps {
  artworks: Artwork[];
  onArtistClick: (a: Artist) => void;
  findArtist: (artistId: string, artistName: string) => Artist | null;
  t: any;
  onImageClick: (url: string, title: string, artist: string) => void;
}

const ArtGrid: React.FC<ArtGridProps> = ({ artworks, onArtistClick, findArtist, t, onImageClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-10 md:gap-y-20">
    {artworks.map((art) => (
      <div key={art.id} className="group">
        <div
          className="relative aspect-[3/4] mb-5 md:mb-8 overflow-hidden bg-zinc-100 cursor-zoom-in"
          onClick={() => onImageClick(art.imageUrl, art.title, art.artistName)}
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              const artist = findArtist(art.artistId, art.artistName);
              if (artist) onArtistClick(artist);
            }}
            className="text-sm text-zinc-400 italic hover:text-emerald-600 transition-colors"
          >
            {art.artistName}
          </button>
          <p className="text-xs text-zinc-400 uppercase tracking-widest pt-3 border-t border-zinc-50 mt-4">
            {art.medium} • {art.size}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default Coleccion;
