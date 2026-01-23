
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Coleccion from './pages/Coleccion.tsx';
import Eventos from './pages/Eventos.tsx';
import OtrosEventos from './pages/OtrosEventos.tsx';
import Contacto from './pages/Contacto.tsx';
import Artista from './pages/Artista.tsx';
import Configuracion from './pages/Configuracion.tsx';
import { useData } from './lib/useData';
import { Language } from './types.ts';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  const [lang, setLang] = useState<Language>('ES');

  // Use the data hook for Supabase integration with persistence
  const {
    artists,
    artworks,
    events,
    otherEvents,
    loading,
    setArtists,
    setArtworks,
    setEvents,
    setOtherEvents,
  } = useData();

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

  const renderPage = () => {
    switch (currentPath) {
      case '#/': return <Home onNavigate={navigate} lang={lang} />;
      case '#/coleccion': return <Coleccion artworks={artworks} artists={artists} />;
      case '#/eventos': return <Eventos events={events} />;
      case '#/otros-eventos': return <OtrosEventos events={otherEvents} />;
      case '#/contacto': return <Contacto />;
      case '#/artista': return <Artista lang={lang} />;
      case '#/config': return (
        <Configuracion 
          artworks={artworks}
          events={events}
          otherEvents={otherEvents}
          artists={artists}
          onUpdateArtworks={setArtworks}
          onUpdateEvents={setEvents}
          onUpdateOtherEvents={setOtherEvents}
          onUpdateArtists={setArtists}
        />
      );
      case '#/espacio': 
        return (
          <div className="pt-52 pb-40 max-w-6xl mx-auto px-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-10 text-left">
                <span className="text-emerald-600 text-[11px] font-bold uppercase tracking-[0.6em]">MADRID HEADQUARTERS</span>
                <h1 className="text-7xl serif italic leading-none">Captaloona Art</h1>
                <p className="text-zinc-500 text-xl font-light italic leading-relaxed">
                  Situado en Andrés Mellado 55, este espacio es el laboratorio físico donde las teorías de Loona Contemporary se materializan.
                </p>
                <div className="h-0.5 w-24 bg-zinc-900"></div>
                <div className="space-y-2 text-sm text-zinc-400 font-medium uppercase tracking-widest">
                   <p>Gaztambide, 28015</p>
                   <p>Madrid, España</p>
                </div>
              </div>
              <div className="aspect-[4/5] bg-zinc-100 shadow-3xl overflow-hidden rounded-sm relative">
                <img 
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
                />
              </div>
            </div>
          </div>
        );
      default: return <Home onNavigate={navigate} lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar 
        currentPath={currentPath.replace('#', '')} 
        onNavigate={navigate} 
        lang={lang}
        onLanguageChange={setLang}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
