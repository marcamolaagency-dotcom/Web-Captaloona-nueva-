
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Coleccion from './pages/Coleccion.tsx';
import Eventos from './pages/Eventos.tsx';
import OtrosEventos from './pages/OtrosEventos.tsx';
import Contacto from './pages/Contacto.tsx';
import Artista from './pages/Artista.tsx';
import Artistas from './pages/Artistas.tsx';
import Configuracion from './pages/Configuracion.tsx';
import Espacio from './pages/Espacio.tsx';
import SchemaMarkup from './components/SchemaMarkup.tsx';
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
    featuredArtworkIds,
    loading,
    saveError,
    clearSaveError,
    addArtist,
    editArtist,
    removeArtist,
    addArtwork,
    editArtwork,
    removeArtwork,
    addEvent,
    editEvent,
    removeEvent,
    addOtherEvent,
    removeOtherEvent,
    setFeaturedArtworkIds,
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
      case '#/': return <Home onNavigate={navigate} lang={lang} artworks={artworks} featuredArtworkIds={featuredArtworkIds} events={events} />;
      case '#/coleccion': return <Coleccion artworks={artworks} artists={artists} lang={lang} />;
      case '#/eventos': return <Eventos events={events} />;
      case '#/otros-eventos': return <OtrosEventos events={otherEvents} />;
      case '#/contacto': return <Contacto />;
      case '#/artista': return <Artista lang={lang} />;
      case '#/artistas': return <Artistas artists={artists} artworks={artworks} lang={lang} />;
      case '#/config': return (
        <Configuracion
          artworks={artworks}
          events={events}
          otherEvents={otherEvents}
          artists={artists}
          featuredArtworkIds={featuredArtworkIds}
          saveError={saveError}
          onClearSaveError={clearSaveError}
          onAddArtwork={addArtwork}
          onEditArtwork={editArtwork}
          onRemoveArtwork={removeArtwork}
          onAddEvent={addEvent}
          onEditEvent={editEvent}
          onRemoveEvent={removeEvent}
          onAddOtherEvent={addOtherEvent}
          onRemoveOtherEvent={removeOtherEvent}
          onAddArtist={addArtist}
          onEditArtist={editArtist}
          onRemoveArtist={removeArtist}
          onUpdateFeaturedArtworkIds={setFeaturedArtworkIds}
        />
      );
      case '#/espacio': return <Espacio lang={lang} />;
      default: return <Home onNavigate={navigate} lang={lang} artworks={artworks} featuredArtworkIds={featuredArtworkIds} events={events} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <SchemaMarkup
        currentPath={currentPath}
        artworks={artworks}
        artists={artists}
        events={events}
      />
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
