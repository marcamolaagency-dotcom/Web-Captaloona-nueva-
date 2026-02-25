
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
  const [filterMode, setFilterMode] = useState<'permanentes' | 'artista'>('permanentes');
  const [filterArtist, setFilterArtist] = useState('all');
  const [showArtistSelector, setShowArtistSelector] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{url: string; title: string; artist: string} | null>(null);

  const t = TRANSLATIONS[lang].collection;

  // Filter modes
  const filterKeys: Array<'permanentes' | 'artista'> = ['permanentes', 'artista'];
  const getFilterLabel = (key: 'permanentes' | 'artista') => {
    if (key === 'permanentes') return t.permanentWorks;
    return t.artist;
  };

  // Build complete artist list from both props and artworks
  const allArtists = useMemo(() => {
    const artistMap = new Map<string, Artist>();

    // First add all artists from props
    artists.forEach(artist => {
      artistMap.set(artist.id, artist);
    });

    // Then add/update from artworks (in case artwork has artist info not in artists list)
    artworks.forEach(art => {
      if (!artistMap.has(art.artistId)) {
        // Create artist entry from artwork data
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

  // Get artists that have works in the collection
  const artistsWithWorks = useMemo(() => {
    const artistIds = [...new Set(artworks.map(art => art.artistId))];
    return allArtists.filter(artist => artistIds.includes(artist.id));
  }, [artworks, allArtists]);

  const filteredArt = artworks.filter(art => {
    if (filterMode === 'permanentes') {
      const matchPerm = art.isPermanent === true;
      const matchArtist = filterArtist === 'all' || art.artistId === filterArtist;
      return matchPerm && matchArtist;
    }
    // mode === 'artista'
    return filterArtist === 'all' || art.artistId === filterArtist;
  });

  // Find artist by ID or by name (fallback)
  const findArtist = (artistId: string, artistName: string): Artist | null => {
    // First try to find by ID
    let artist = allArtists.find(a => a.id === artistId);

    // If not found, try by name
    if (!artist) {
      artist = allArtists.find(a => a.name.toLowerCase() === artistName.toLowerCase());
    }

    // If still not found, create a basic artist object
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
      <div className="pt-32 pb-24 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24 bg-zinc-50 p-12 rounded-sm border border-zinc-100">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full border-2 border-emerald-100"></div>
              <img src={selectedArtistProfile.imageUrl} alt={selectedArtistProfile.name} className="relative z-10 w-full aspect-square object-cover shadow-2xl" />
            </div>
            <div className="space-y-8">
              <button
                onClick={() => setSelectedArtistProfile(null)}
                className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-700 transition-colors"
              >
                ← {t.backToCatalog}
              </button>
              <h1 className="text-6xl serif">{selectedArtistProfile.name}</h1>
              {selectedArtistProfile.bio && (
                <p className="text-zinc-500 leading-relaxed text-lg">{selectedArtistProfile.bio}</p>
              )}
              <div className="flex gap-10">
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

          <h2 className="text-3xl serif mb-12 border-b pb-6">{t.catalogOf} {selectedArtistProfile.name}</h2>
          <ArtGrid
            artworks={artistWorks}
            onArtistClick={setSelectedArtistProfile}
            findArtist={findArtist}
            t={t}
            onImageClick={(url, title, artist) => setLightboxImage({url, title, artist})}
          />
        </div>
      </div>
    );
  }

  // View: Main Collection
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl serif mb-6">{t.title}</h1>
          <p className="text-zinc-500 leading-relaxed">
            {t.description}
          </p>
        </header>

        {/* Filters Section */}
        <div className="mb-16 space-y-6">
          <div className="border-b border-zinc-100 pb-6">
            <div className="flex justify-center gap-3 flex-wrap">
              {filterKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setFilterMode(key);
                    if (key === 'artista') {
                      setShowArtistSelector(true);
                    } else {
                      setShowArtistSelector(false);
                      setFilterArtist('all');
                    }
                  }}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    filterMode === key
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                  }`}
                >
                  {getFilterLabel(key)}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Artist Selector View */}
        {showArtistSelector && (
          <div className="mb-16 animate-fadeIn">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6 text-center">{t.selectArtist}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artistsWithWorks.map((artist) => (
                <button
                  key={artist.id}
                  onClick={() => {
                    setFilterArtist(artist.id);
                    setShowArtistSelector(false);
                  }}
                  className="group text-left bg-zinc-50 hover:bg-emerald-50 p-6 rounded-sm transition-all border border-zinc-100 hover:border-emerald-200"
                >
                  <div className="aspect-square mb-4 overflow-hidden rounded-full bg-zinc-200">
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="text-lg serif text-center group-hover:text-emerald-600 transition-colors">{artist.name}</h4>
                  {artist.location && (
                    <p className="text-[10px] text-zinc-400 text-center mt-1 uppercase tracking-widest">{artist.location}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active artist filter indicator */}
        {filterArtist !== 'all' && !showArtistSelector && (
          <div className="mb-8 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100">
              <span className="text-sm text-emerald-700">
                {t.showingWorksBy} <strong>{artistsWithWorks.find(a => a.id === filterArtist)?.name || filterArtist}</strong>
              </span>
              <button
                onClick={() => setFilterArtist('all')}
                className="text-emerald-600 hover:text-emerald-800 text-xs font-bold uppercase tracking-widest"
              >
                × {t.clear}
              </button>
            </div>
          </div>
        )}

        {/* Results count */}
        {!showArtistSelector && (
          <div className="mb-8 text-center">
            <p className="text-sm text-zinc-400">
              {filteredArt.length} {filteredArt.length === 1 ? t.workFound : t.worksFound}
            </p>
          </div>
        )}

        {/* Art Grid */}
        {!showArtistSelector && (
          filteredArt.length > 0 ? (
            <ArtGrid
              artworks={filteredArt}
              onArtistClick={setSelectedArtistProfile}
              findArtist={findArtist}
              t={t}
              onImageClick={(url, title, artist) => setLightboxImage({url, title, artist})}
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-lg">{t.noWorksFound}</p>
              <button
                onClick={() => {
                  setFilterMode('permanentes');
                  setFilterArtist('all');
                  setShowArtistSelector(false);
                }}
                className="mt-4 text-emerald-600 text-sm font-bold uppercase tracking-widest hover:text-emerald-700"
              >
                {t.clearFilters}
              </button>
            </div>
          )
        )}
      </div>

      {/* Image Lightbox */}
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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
    {artworks.map((art) => (
      <div key={art.id} className="group">
        <div
          className="relative aspect-[3/4] mb-8 overflow-hidden bg-zinc-100 cursor-zoom-in"
          onClick={() => onImageClick(art.imageUrl, art.title, art.artistName)}
        >
          <img
            src={art.imageUrl}
            alt={art.title}
            className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${art.status === 'vendido' ? 'opacity-60 grayscale-[0.5]' : ''}`}
          />
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            <span className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm ${art.status === 'disponible' ? 'bg-white text-emerald-600' : 'bg-zinc-900 text-white opacity-90'}`}>
              {art.status === 'disponible' ? `${art.price}€` : t.sold}
            </span>
            {(art.style || art.category) && (
              <span className="bg-white/80 px-3 py-1 text-[8px] uppercase tracking-tighter text-zinc-500 backdrop-blur-md">
                {art.style || art.category}
              </span>
            )}
          </div>
          {/* Zoom indicator on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-medium text-zinc-700 shadow-lg">
              Click para ampliar
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl serif group-hover:text-emerald-600 transition-colors">{art.title}</h3>
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
