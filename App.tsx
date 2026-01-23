
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
import Espacio from './pages/Espacio.tsx';
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
      case '#/espacio': return <Espacio />;
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
