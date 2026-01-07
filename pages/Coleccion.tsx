
import React, { useState } from 'react';
import { ARTISTS } from '../constants.tsx';
import { Artwork, Artist } from '../types';

interface ColeccionProps {
  artworks: Artwork[];
}

const Coleccion: React.FC<ColeccionProps> = ({ artworks }) => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [filter, setFilter] = useState('Todas');
  
  const categories = ['Todas', 'Pintura', 'Escultura', 'Poesía', 'Narrativa'];

  const filteredArt = artworks.filter(art => {
    const matchCategory = filter === 'Todas' || art.category === filter;
    const matchArtist = !selectedArtist || art.artistId === selectedArtist.id;
    return matchCategory && matchArtist;
  });

  if (selectedArtist) {
    return (
      <div className="pt-32 pb-24 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24 bg-zinc-50 p-12 rounded-sm border border-zinc-100">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full border-2 border-emerald-100"></div>
              <img src={selectedArtist.imageUrl} alt={selectedArtist.name} className="relative z-10 w-full aspect-square object-cover shadow-2xl" />
            </div>
            <div className="space-y-8">
              <button 
                onClick={() => setSelectedArtist(null)}
                className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2"
              >
                ← Volver al catálogo general
              </button>
              <h1 className="text-6xl serif">{selectedArtist.name}</h1>
              <p className="text-zinc-500 leading-relaxed text-lg">{selectedArtist.bio}</p>
              <div className="flex gap-10">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Ubicación</h4>
                  <p className="text-sm">{selectedArtist.location}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Colección</h4>
                  <p className="text-sm">{artworks.filter(a => a.artistId === selectedArtist.id).length} Obras</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl serif mb-12 border-b pb-6">Catálogo de {selectedArtist.name}</h2>
          <ArtGrid artworks={filteredArt} onArtistClick={setSelectedArtist} />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl serif mb-6">Colección Captaloona</h1>
          <p className="text-zinc-500 leading-relaxed">
            Una selección multidisciplinar donde el arte matérico, la palabra y la forma convergen. Explora por categoría o descubre la visión única de nuestros artistas.
          </p>
        </header>

        <div className="flex justify-center gap-4 mb-20 border-y border-zinc-100 py-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${filter === c ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <ArtGrid artworks={filteredArt} onArtistClick={setSelectedArtist} />
      </div>
    </div>
  );
};

const ArtGrid: React.FC<{ artworks: Artwork[], onArtistClick: (a: Artist) => void }> = ({ artworks, onArtistClick }) => (
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
              const artist = ARTISTS.find(a => a.id === art.artistId);
              if (artist) onArtistClick(artist);
            }}
            className="text-sm text-zinc-400 italic hover:text-emerald-600"
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
