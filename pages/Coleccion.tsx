
import React, { useState, useMemo } from 'react';
import { Artwork, Artist } from '../types';

interface ColeccionProps {
  artworks: Artwork[];
  artists?: Artist[];
}

const Coleccion: React.FC<ColeccionProps> = ({ artworks, artists = [] }) => {
  const [selectedArtistProfile, setSelectedArtistProfile] = useState<Artist | null>(null);
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [filterArtist, setFilterArtist] = useState('Todos');
  const [showArtistSelector, setShowArtistSelector] = useState(false);

  const categories = ['Todas', 'Pintura', 'Escultura', 'Poesía', 'Narrativa', 'Artista'];

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
    const matchCategory = filterCategory === 'Todas' || art.category === filterCategory;
    const matchArtist = filterArtist === 'Todos' || art.artistId === filterArtist;
    return matchCategory && matchArtist;
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
                ← Volver al catálogo general
              </button>
              <h1 className="text-6xl serif">{selectedArtistProfile.name}</h1>
              {selectedArtistProfile.bio && (
                <p className="text-zinc-500 leading-relaxed text-lg">{selectedArtistProfile.bio}</p>
              )}
              <div className="flex gap-10">
                {selectedArtistProfile.location && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Ubicación</h4>
                    <p className="text-sm">{selectedArtistProfile.location}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Colección</h4>
                  <p className="text-sm">{artistWorks.length} Obras</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl serif mb-12 border-b pb-6">Catálogo de {selectedArtistProfile.name}</h2>
          <ArtGrid
            artworks={artistWorks}
            onArtistClick={setSelectedArtistProfile}
            findArtist={findArtist}
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
          <h1 className="text-5xl serif mb-6">Colección Captaloona</h1>
          <p className="text-zinc-500 leading-relaxed">
            Una selección multidisciplinar donde el arte matérico, la palabra y la forma convergen. Explora por categoría o descubre la visión única de nuestros artistas.
          </p>
        </header>

        {/* Filters Section */}
        <div className="mb-16 space-y-6">
          {/* Category Filter */}
          <div className="border-b border-zinc-100 pb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 text-center">Categoría</h3>
            <div className="flex justify-center gap-3 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    if (c === 'Artista') {
                      setShowArtistSelector(true);
                      setFilterCategory('Todas');
                    } else {
                      setShowArtistSelector(false);
                      setFilterCategory(c);
                      setFilterArtist('Todos');
                    }
                  }}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    (c === 'Artista' && showArtistSelector) || (c !== 'Artista' && filterCategory === c && !showArtistSelector)
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Artist Selector View */}
        {showArtistSelector && (
          <div className="mb-16 animate-fadeIn">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6 text-center">Selecciona un Artista</h3>
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
        {filterArtist !== 'Todos' && !showArtistSelector && (
          <div className="mb-8 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100">
              <span className="text-sm text-emerald-700">
                Mostrando obras de: <strong>{artistsWithWorks.find(a => a.id === filterArtist)?.name || filterArtist}</strong>
              </span>
              <button
                onClick={() => setFilterArtist('Todos')}
                className="text-emerald-600 hover:text-emerald-800 text-xs font-bold uppercase tracking-widest"
              >
                × Limpiar
              </button>
            </div>
          </div>
        )}

        {/* Results count */}
        {!showArtistSelector && (
          <div className="mb-8 text-center">
            <p className="text-sm text-zinc-400">
              {filteredArt.length} {filteredArt.length === 1 ? 'obra encontrada' : 'obras encontradas'}
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
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-lg">No se encontraron obras con los filtros seleccionados.</p>
              <button
                onClick={() => {
                  setFilterCategory('Todas');
                  setFilterArtist('Todos');
                }}
                className="mt-4 text-emerald-600 text-sm font-bold uppercase tracking-widest hover:text-emerald-700"
              >
                Limpiar filtros
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

interface ArtGridProps {
  artworks: Artwork[];
  onArtistClick: (a: Artist) => void;
  findArtist: (artistId: string, artistName: string) => Artist | null;
}

const ArtGrid: React.FC<ArtGridProps> = ({ artworks, onArtistClick, findArtist }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
    {artworks.map((art) => (
      <div key={art.id} className="group cursor-pointer">
        <div className="relative aspect-[3/4] mb-8 overflow-hidden bg-zinc-100">
          <img
            src={art.imageUrl}
            alt={art.title}
            className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${art.status === 'vendido' ? 'opacity-60 grayscale-[0.5]' : ''}`}
          />
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            <span className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm ${art.status === 'disponible' ? 'bg-white text-emerald-600' : 'bg-zinc-900 text-white opacity-90'}`}>
              {art.status === 'disponible' ? `${art.price}€` : 'Vendido'}
            </span>
            <span className="bg-white/80 px-3 py-1 text-[8px] uppercase tracking-tighter text-zinc-500 backdrop-blur-md">
              {art.category}
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
