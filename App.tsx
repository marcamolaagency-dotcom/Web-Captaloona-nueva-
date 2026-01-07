
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profiler from './pages/Profiler';
import Coleccion from './pages/Coleccion';
import Eventos from './pages/Eventos';
import Contacto from './pages/Contacto';
import Artista from './pages/Artista';
import Admin from './pages/Admin';
import { INITIAL_ARTWORKS, INITIAL_EVENTS, ARTISTS as INITIAL_ARTISTS } from './constants.tsx';
import { Artwork, EventItem, Artist } from './types';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  const [artworks, setArtworks] = useState<Artwork[]>(INITIAL_ARTWORKS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [artists, setArtists] = useState<Artist[]>(INITIAL_ARTISTS);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [tempPassword, setTempPassword] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempPassword === 'captaloona2024') {
      setIsAdminLoggedIn(true);
      setTempPassword('');
      navigate('/admin');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const renderPage = () => {
    switch (currentPath) {
      case '#/': return <Home onNavigate={navigate} />;
      case '#/profiler': return <Profiler />;
      case '#/coleccion': return <Coleccion artworks={artworks} />;
      case '#/eventos': return <Eventos events={events} />;
      case '#/contacto': return <Contacto />;
      case '#/artista': return <Artista />;
      case '#/admin': 
        if (!isAdminLoggedIn) {
          return (
            <div className="pt-48 pb-24 max-w-md mx-auto px-6 text-center animate-fadeIn">
              <div className="bg-white p-10 shadow-2xl border border-zinc-100 rounded-sm">
                <h1 className="text-3xl serif mb-4">Acceso Restringido</h1>
                <p className="text-sm text-zinc-500 mb-8 uppercase tracking-widest">Introduce la contraseña de gestión</p>
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <input 
                    type="password" 
                    placeholder="Contraseña"
                    className="w-full border-b border-zinc-200 py-2 text-center focus:outline-none focus:border-emerald-600 transition-colors"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="w-full bg-zinc-900 text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all">
                    Entrar al Panel
                  </button>
                  <button type="button" onClick={() => navigate('/')} className="text-xs text-zinc-400 hover:text-zinc-900 uppercase tracking-widest pt-4">
                    Cancelar
                  </button>
                </form>
              </div>
            </div>
          );
        }
        return (
          <Admin 
            artworks={artworks} 
            events={events} 
            artists={artists}
            onUpdateArtworks={setArtworks} 
            onUpdateEvents={setEvents} 
            onUpdateArtists={setArtists}
          />
        );
      default: return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar currentPath={currentPath.replace('#', '')} onNavigate={navigate} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      
      {/* Botón discreto de Admin */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => navigate('/admin')}
          className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all shadow-lg ${isAdminLoggedIn ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white/80 backdrop-blur-md border-zinc-200 text-zinc-400 hover:text-emerald-600 hover:border-emerald-600'}`}
          title="Administración"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
