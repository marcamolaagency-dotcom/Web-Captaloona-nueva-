
import React, { useState } from 'react';
import { Artwork, EventItem, OtherEvent, Artist } from '../types';
import { useAuth } from '../lib/useAuth';
import { isSupabaseConfigured } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';

interface ConfiguracionProps {
  artworks: Artwork[];
  events: EventItem[];
  otherEvents: OtherEvent[];
  artists: Artist[];
  onUpdateArtworks: (arts: Artwork[]) => void;
  onUpdateEvents: (evs: EventItem[]) => void;
  onUpdateOtherEvents: (evs: OtherEvent[]) => void;
  onUpdateArtists: (artists: Artist[]) => void;
}

const Configuracion: React.FC<ConfiguracionProps> = ({
  artworks, events, otherEvents, artists,
  onUpdateArtworks, onUpdateEvents, onUpdateOtherEvents, onUpdateArtists
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'obras' | 'exposiciones' | 'otros' | 'artistas'>('obras');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Image URLs for forms
  const [artworkImageUrl, setArtworkImageUrl] = useState('');
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [otherEventImageUrl, setOtherEventImageUrl] = useState('');
  const [artistImageUrl, setArtistImageUrl] = useState('');

  const { isAuthenticated, login, loginWithPassword, logout, user } = useAuth();
  const supabaseEnabled = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      if (supabaseEnabled && email) {
        const success = await login(email, password);
        if (!success) {
          setLoginError('Credenciales incorrectas. Verifica tu email y contraseña.');
        }
      } else {
        const success = loginWithPassword(password);
        if (!success) {
          setLoginError('Contraseña incorrecta');
        }
      }
    } catch (err) {
      setLoginError('Error al iniciar sesión');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // Reset form helper
  const resetArtworkForm = () => {
    setArtworkImageUrl('');
  };

  const resetEventForm = () => {
    setEventImageUrl('');
  };

  const resetOtherEventForm = () => {
    setOtherEventImageUrl('');
  };

  const resetArtistForm = () => {
    setArtistImageUrl('');
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-60 pb-40 flex items-center justify-center animate-fadeIn">
        <div className="max-w-md w-full px-8 py-12 bg-zinc-50 border border-zinc-100 shadow-sm text-center space-y-8">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold tracking-[0.2em] text-zinc-900 serif uppercase">CAPTALOONA</span>
            <span className="text-[10px] tracking-[0.3em] text-zinc-400 font-medium uppercase mt-1">ADMINISTRATION</span>
          </div>
          <p className="text-zinc-500 text-sm font-light italic">
            {supabaseEnabled
              ? 'Introduce tus credenciales para gestionar los contenidos.'
              : 'Introduce la clave de acceso para gestionar los contenidos.'}
          </p>
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            {supabaseEnabled && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-zinc-200 focus:outline-none focus:border-emerald-600 text-sm"
                autoFocus
              />
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 border border-zinc-200 focus:outline-none focus:border-emerald-600 text-sm"
              autoFocus={!supabaseEnabled}
            />
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-zinc-900 text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Accediendo...' : 'Acceder'}
            </button>
          </form>
          {!supabaseEnabled && (
            <p className="text-[10px] text-zinc-400">
              Modo offline - Los cambios no se guardarán permanentemente
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 max-w-[1400px] mx-auto px-8 animate-fadeIn">
      {/* Header with logout */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {user?.email && (
            <span className="text-xs text-zinc-400">
              {user.email}
            </span>
          )}
          {!supabaseEnabled && (
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded">
              Modo Offline
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-[10px] text-zinc-400 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="flex justify-between items-end mb-16 border-b border-zinc-100 pb-10">
        <div>
          <h1 className="text-5xl serif italic">Panel de Configuración</h1>
          <p className="text-zinc-400 text-sm font-light mt-2">Gestión de contenidos dinámicos del sitio web.</p>
        </div>
        <div className="flex bg-zinc-50 p-1 rounded-sm border border-zinc-100">
          {(['obras', 'exposiciones', 'otros', 'artistas'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-[9px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm ${activeTab === tab ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* OBRAS TAB */}
      {activeTab === 'obras' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-8 bg-zinc-50 p-8 rounded-sm">
            <h2 className="text-xl serif italic mb-6">Añadir Nueva Obra</h2>
            <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newArt: Artwork = {
                    id: Date.now().toString(),
                    title: form.title.value,
                    artistId: form.artistId.value,
                    artistName: artists.find(a => a.id === form.artistId.value)?.name || '',
                    medium: form.medium.value,
                    size: form.size.value,
                    price: Number(form.price.value),
                    category: form.category.value,
                    status: 'disponible',
                    imageUrl: artworkImageUrl || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19'
                };
                onUpdateArtworks([newArt, ...artworks]);
                form.reset();
                resetArtworkForm();
            }}>
              <input name="title" placeholder="Título de la obra" className="w-full p-3 border-b bg-transparent border-zinc-200 focus:outline-none focus:border-emerald-600 text-sm" required />
              <select name="artistId" className="w-full p-3 border-b bg-transparent border-zinc-200 focus:outline-none text-sm" required>
                <option value="">Seleccionar Artista</option>
                {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input name="price" type="number" placeholder="Precio (€)" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm" />
                <select name="category" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm">
                    <option>Pintura</option>
                    <option>Escultura</option>
                    <option>Poesía</option>
                    <option>Narrativa</option>
                </select>
              </div>
              <input name="medium" placeholder="Técnica" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm" />
              <input name="size" placeholder="Medidas (ej: 100x100 cm)" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm" />

              {/* Image Upload Component */}
              <ImageUpload
                onImageUploaded={setArtworkImageUrl}
                currentImageUrl={artworkImageUrl}
                folder="artworks"
                label="Imagen de la obra"
              />

              <button className="w-full bg-zinc-900 text-white py-4 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all">Añadir a Colección</button>
            </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl serif italic mb-6">Listado de Obras ({artworks.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {artworks.map(art => (
                <div key={art.id} className="flex gap-4 p-4 border border-zinc-100 items-center bg-white shadow-sm hover:shadow-md transition-shadow">
                  <img src={art.imageUrl} className="w-16 h-16 object-cover grayscale" />
                  <div className="flex-grow">
                    <p className="font-bold text-xs uppercase tracking-widest">{art.title}</p>
                    <p className="text-[10px] text-zinc-400">{art.artistName}</p>
                  </div>
                  <button onClick={() => onUpdateArtworks(artworks.filter(a => a.id !== art.id))} className="text-zinc-300 hover:text-red-500 p-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EXPOSICIONES TAB */}
      {activeTab === 'exposiciones' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-8 bg-zinc-50 p-8 rounded-sm">
            <h2 className="text-xl serif italic mb-6">Nueva Exposición</h2>
            <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newEv: EventItem = {
                    id: Date.now().toString(),
                    title: form.title.value,
                    date: form.date.value,
                    location: form.location.value,
                    description: form.description.value,
                    imageUrl: eventImageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
                };
                onUpdateEvents([newEv, ...events]);
                form.reset();
                resetEventForm();
            }}>
              <input name="title" placeholder="Nombre de la expo" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm" required />
              <input name="date" placeholder="Fecha (ej: 12 DIC 2024)" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm" required />
              <input name="location" placeholder="Sede" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm" />
              <textarea name="description" placeholder="Resumen corto" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm h-32 resize-none" />

              {/* Image Upload Component */}
              <ImageUpload
                onImageUploaded={setEventImageUrl}
                currentImageUrl={eventImageUrl}
                folder="events"
                label="Imagen de la exposición"
              />

              <button className="w-full bg-zinc-900 text-white py-4 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all">Publicar Exposición</button>
            </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
             {events.map(ev => (
                <div key={ev.id} className="flex gap-6 p-6 border border-zinc-100 bg-white items-start">
                   <img src={ev.imageUrl} className="w-24 h-24 object-cover grayscale" />
                   <div className="flex-grow">
                      <p className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase mb-1">{ev.date}</p>
                      <h3 className="text-xl serif italic">{ev.title}</h3>
                      <p className="text-xs text-zinc-400 mt-2">{ev.location}</p>
                   </div>
                   <button onClick={() => onUpdateEvents(events.filter(e => e.id !== ev.id))} className="text-zinc-300 hover:text-red-500">
                     Eliminar
                   </button>
                </div>
             ))}
          </div>
        </div>
      )}

      {/* OTROS EVENTOS TAB */}
      {activeTab === 'otros' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-8 bg-zinc-50 p-8 rounded-sm">
            <h2 className="text-xl serif italic mb-6">Añadir Evento Vario</h2>
            <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newEv: OtherEvent = {
                    id: Date.now().toString(),
                    title: form.title.value,
                    date: form.date.value,
                    category: form.category.value,
                    description: form.description.value,
                    imageUrl: otherEventImageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4'
                };
                onUpdateOtherEvents([newEv, ...otherEvents]);
                form.reset();
                resetOtherEventForm();
            }}>
              <input name="title" placeholder="Título del evento" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm" required />
              <input name="date" placeholder="Fecha" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm" required />
              <input name="category" placeholder="Categoría (Taller, Charla, etc.)" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm" />
              <textarea name="description" placeholder="Descripción" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm h-32 resize-none" />

              {/* Image Upload Component */}
              <ImageUpload
                onImageUploaded={setOtherEventImageUrl}
                currentImageUrl={otherEventImageUrl}
                folder="events"
                label="Imagen del evento"
              />

              <button className="w-full bg-zinc-900 text-white py-4 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all">Crear Evento</button>
            </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
             {otherEvents.map(ev => (
                <div key={ev.id} className="flex gap-6 p-6 border border-zinc-100 bg-white items-center">
                   <img src={ev.imageUrl} className="w-20 h-20 object-cover grayscale" />
                   <div className="flex-grow">
                      <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">{ev.date} • {ev.category}</p>
                      <h3 className="text-lg serif italic">{ev.title}</h3>
                   </div>
                   <button onClick={() => onUpdateOtherEvents(otherEvents.filter(e => e.id !== ev.id))} className="text-zinc-300 hover:text-red-500">
                     Borrar
                   </button>
                </div>
             ))}
          </div>
        </div>
      )}

      {/* ARTISTAS TAB */}
      {activeTab === 'artistas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-8 bg-zinc-50 p-8 rounded-sm">
            <h2 className="text-xl serif italic mb-6">Gestionar Artistas</h2>
            <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newArtist: Artist = {
                    id: form.name.value.toLowerCase().replace(/\s+/g, '-'),
                    name: form.name.value,
                    bio: form.bio.value,
                    location: form.location.value,
                    imageUrl: artistImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
                };
                onUpdateArtists([...artists, newArtist]);
                form.reset();
                resetArtistForm();
            }}>
              <input name="name" placeholder="Nombre completo" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm" required />
              <input name="location" placeholder="Ubicación" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm" />
              <textarea name="bio" placeholder="Biografía" className="w-full p-3 border-b bg-transparent border-zinc-200 text-sm h-40 resize-none" />

              {/* Image Upload Component */}
              <ImageUpload
                onImageUploaded={setArtistImageUrl}
                currentImageUrl={artistImageUrl}
                folder="artists"
                label="Foto del artista"
              />

              <button className="w-full bg-zinc-900 text-white py-4 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all">Registrar Artista</button>
            </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
             {artists.map(a => (
                <div key={a.id} className="flex gap-6 p-6 border border-zinc-100 bg-white items-center">
                   <img src={a.imageUrl} className="w-16 h-16 rounded-full object-cover grayscale" />
                   <div className="flex-grow">
                      <h3 className="text-lg serif italic">{a.name}</h3>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{a.location}</p>
                   </div>
                   {a.id !== 'claudio-fiorentini' && (
                     <button onClick={() => onUpdateArtists(artists.filter(art => art.id !== a.id))} className="text-zinc-300 hover:text-red-500">
                        Eliminar
                     </button>
                   )}
                </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracion;
