
import React, { useState } from 'react';
import { Artwork, EventItem, Artist } from '../types';

interface AdminProps {
  artworks: Artwork[];
  events: EventItem[];
  artists: Artist[];
  onUpdateArtworks: (arts: Artwork[]) => void;
  onUpdateEvents: (evs: EventItem[]) => void;
  onUpdateArtists: (artists: Artist[]) => void;
}

const Admin: React.FC<AdminProps> = ({ artworks, events, artists, onUpdateArtworks, onUpdateEvents, onUpdateArtists }) => {
  const [activeTab, setActiveTab] = useState<'obras' | 'artistas' | 'eventos'>('obras');
  
  // Form States
  const [newArt, setNewArt] = useState<Partial<Artwork>>({ category: 'Pintura', status: 'disponible', artistId: artists[0]?.id || '' });
  const [newArtist, setNewArtist] = useState<Partial<Artist>>({});
  const [newEvent, setNewEvent] = useState<Partial<EventItem>>({});

  const toggleStatus = (id: string) => {
    const updated = artworks.map(art => 
      art.id === id ? { ...art, status: art.status === 'disponible' ? 'vendido' : 'disponible' } : art
    );
    onUpdateArtworks(updated);
  };

  const handleAddArt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArt.artistId) return alert('Selecciona un artista primero');
    const artist = artists.find(a => a.id === newArt.artistId);
    const art: Artwork = {
      ...newArt as Artwork,
      id: Date.now().toString(),
      artistName: artist?.name || 'Artista',
      imageUrl: newArt.imageUrl || 'https://picsum.photos/600/800'
    };
    onUpdateArtworks([art, ...artworks]);
    alert('Obra añadida con éxito');
  };

  const handleAddArtist = (e: React.FormEvent) => {
    e.preventDefault();
    const art: Artist = {
      id: (newArtist.name || 'artist').toLowerCase().replace(/\s+/g, '-'),
      name: newArtist.name || 'Nuevo Artista',
      bio: newArtist.bio || '',
      imageUrl: newArtist.imageUrl || 'https://picsum.photos/400/400',
      location: newArtist.location || 'Madrid, España'
    };
    onUpdateArtists([...artists, art]);
    alert('Artista registrado correctamente');
    setNewArtist({});
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const ev: EventItem = {
      ...newEvent as EventItem,
      id: Date.now().toString(),
      imageUrl: newEvent.imageUrl || 'https://picsum.photos/800/400'
    };
    onUpdateEvents([ev, ...events]);
    alert('Evento publicado con éxito');
    setNewEvent({});
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 animate-fadeIn">
      <div className="mb-12 border-b border-zinc-200 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl serif mb-2">Panel de Control</h1>
          <p className="text-zinc-500">Administra el catálogo completo de Captaloona Art.</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-lg">
          {['obras', 'artistas', 'eventos'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow-sm text-emerald-600' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'obras' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 border border-zinc-100 shadow-xl rounded-sm sticky top-32">
              <h2 className="text-xl serif mb-6">Subir Nueva Obra</h2>
              <form onSubmit={handleAddArt} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Título</label>
                  <input required className="w-full border-b py-2 focus:outline-none focus:border-emerald-600" onChange={e => setNewArt({...newArt, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Artista</label>
                  <select className="w-full border-b py-2 bg-transparent" onChange={e => setNewArt({...newArt, artistId: e.target.value})}>
                    <option value="">Selecciona Artista...</option>
                    {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Categoría</label>
                    <select className="w-full border-b py-2 bg-transparent" onChange={e => setNewArt({...newArt, category: e.target.value as any})}>
                      <option>Pintura</option>
                      <option>Escultura</option>
                      <option>Poesía</option>
                      <option>Narrativa</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Precio €</label>
                    <input type="number" className="w-full border-b py-2" onChange={e => setNewArt({...newArt, price: Number(e.target.value)})} />
                  </div>
                </div>
                <input placeholder="Técnica" className="w-full border-b py-2" onChange={e => setNewArt({...newArt, medium: e.target.value})} />
                <input placeholder="Dimensiones" className="w-full border-b py-2" onChange={e => setNewArt({...newArt, size: e.target.value})} />
                <input required type="url" placeholder="URL Imagen Obra" className="w-full border-b py-2" onChange={e => setNewArt({...newArt, imageUrl: e.target.value})} />
                <button className="w-full bg-zinc-900 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors mt-4">Publicar Obra</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white border border-zinc-100 rounded-sm">
              <div className="divide-y divide-zinc-100">
                {artworks.map(art => (
                  <div key={art.id} className="p-6 flex items-center gap-6 group hover:bg-zinc-50 transition-colors">
                    <img src={art.imageUrl} className="w-20 h-20 object-cover rounded shadow-sm" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{art.title}</h3>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest">{art.artistName} • {art.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleStatus(art.id)}
                        className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-tighter transition-all ${art.status === 'disponible' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
                      >
                        {art.status}
                      </button>
                      <button 
                        onClick={() => onUpdateArtworks(artworks.filter(a => a.id !== art.id))}
                        className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'artistas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 border border-zinc-100 shadow-xl rounded-sm">
              <h2 className="text-xl serif mb-6">Añadir Artista</h2>
              <form onSubmit={handleAddArtist} className="space-y-4">
                <input required placeholder="Nombre Completo" className="w-full border-b py-2" onChange={e => setNewArtist({...newArtist, name: e.target.value})} />
                <input placeholder="Ubicación (ej: Madrid, España)" className="w-full border-b py-2" onChange={e => setNewArtist({...newArtist, location: e.target.value})} />
                <textarea placeholder="Biografía corta" className="w-full border-b py-2 h-32 resize-none" onChange={e => setNewArtist({...newArtist, bio: e.target.value})} />
                <input required type="url" placeholder="URL Foto de Perfil" className="w-full border-b py-2" onChange={e => setNewArtist({...newArtist, imageUrl: e.target.value})} />
                <button className="w-full bg-zinc-900 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors">Guardar Artista</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {artists.map(a => (
                <div key={a.id} className="bg-white p-6 border border-zinc-100 rounded-sm flex items-center gap-4">
                  <img src={a.imageUrl} className="w-16 h-16 rounded-full object-cover border-2 border-zinc-100" />
                  <div className="flex-1">
                    <h3 className="font-bold">{a.name}</h3>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{a.location}</p>
                  </div>
                  {a.id !== 'claudio-fiorentini' && (
                    <button onClick={() => onUpdateArtists(artists.filter(art => art.id !== a.id))} className="text-zinc-300 hover:text-red-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'eventos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 border border-zinc-100 shadow-xl rounded-sm">
              <h2 className="text-xl serif mb-6">Nuevo Evento</h2>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <input required placeholder="Título" className="w-full border-b py-2" onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                <input required placeholder="Fecha (ej: 12 DIC)" className="w-full border-b py-2" onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                <input placeholder="Ubicación" className="w-full border-b py-2" onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                <textarea placeholder="Descripción" className="w-full border-b py-2 h-24" onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                <input required type="url" placeholder="URL Portada" className="w-full border-b py-2" onChange={e => setNewEvent({...newEvent, imageUrl: e.target.value})} />
                <button className="w-full bg-zinc-900 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors">Publicar</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {events.map(ev => (
                <div key={ev.id} className="bg-white p-6 border border-zinc-100 flex gap-6 items-center">
                  <img src={ev.imageUrl} className="w-24 h-24 object-cover" />
                  <div className="flex-1">
                    <p className="text-xs text-emerald-600 font-bold mb-1 tracking-widest">{ev.date}</p>
                    <h3 className="text-lg serif">{ev.title}</h3>
                    <p className="text-xs text-zinc-400">{ev.location}</p>
                  </div>
                  <button onClick={() => onUpdateEvents(events.filter(e => e.id !== ev.id))} className="text-zinc-300 hover:text-red-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
