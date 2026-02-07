
import React from 'react';
import { Language, Artwork, EventItem } from '../types.ts';
import { TRANSLATIONS } from '../translations.ts';

interface HomeProps {
  onNavigate: (path: string) => void;
  lang: Language;
  artworks: Artwork[];
  featuredArtworkIds: string[];
  events: EventItem[];
}

// Helper function to parse date strings like "24 NOV 2024" to Date objects
const parseEventDate = (dateStr: string): Date => {
  const months: Record<string, number> = {
    'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AGO': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11,
    'JAN': 0, 'APR': 3, 'AUG': 7, 'DEC': 11
  };

  const parts = dateStr.trim().toUpperCase().split(/\s+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]] ?? 0;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(0);
};


const Home: React.FC<HomeProps> = ({ onNavigate, lang, artworks, featuredArtworkIds, events }) => {
  const t = TRANSLATIONS[lang]?.home || TRANSLATIONS['ES'].home;

  // Get Claudio's artworks for the Coach section
  const claudioArtworks = artworks.filter(a =>
    a.artistId === 'claudio-fiorentini' ||
    a.artistName?.toLowerCase().includes('claudio') ||
    a.artistName?.toLowerCase().includes('fiorentini')
  );
  const coachImage = claudioArtworks.length > 0
    ? claudioArtworks[0].imageUrl
    : "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200";

  // Get the most recent/upcoming event for the featured exhibition section
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = parseEventDate(a.date);
    const dateB = parseEventDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  const featuredEvent = sortedEvents.length > 0 ? sortedEvents[0] : null;

  // Get featured artworks (selected in admin) or fallback to defaults
  const featuredArtworks = featuredArtworkIds
    .map(id => artworks.find(a => a.id === id))
    .filter((a): a is Artwork => a !== undefined);

  // Fallback images if no featured artworks selected
  const defaultFeaturedImages = [
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop"
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop"
            alt="Gallery Background"
            className="w-full h-full object-cover opacity-10 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
          <h1 className="text-6xl md:text-9xl font-normal text-zinc-900 mb-12 leading-[1.1] serif animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {t.heroTitle}
          </h1>
          <p className="text-xl text-zinc-500 mb-16 max-w-2xl mx-auto leading-relaxed italic font-light animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            {t.heroDesc}
          </p>

          {/* Banner Art Profiler destacado */}
          <div className="animate-fadeIn mt-12" style={{ animationDelay: '0.6s' }}>
            <div className="bg-zinc-50 border border-zinc-100 p-10 md:p-14 rounded-sm shadow-sm inline-block w-full max-w-3xl group transition-all hover:shadow-lg">
               <h3 className="text-zinc-900 text-2xl serif mb-8 italic">{t.bannerProfiler}</h3>
               <a
                href="https://captaloona-art-profile.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-14 py-6 bg-zinc-900 text-white tracking-[0.4em] uppercase text-[10px] font-bold hover:bg-emerald-600 transition-all shadow-xl"
               >
                 {t.bannerBtn}
               </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inner Vision Section - Visualizador de Arte */}
      <section className="py-32 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8 text-white">
              <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.5em]">
                {t.innerVisionLabel}
              </span>
              <h2 className="text-5xl md:text-6xl serif italic leading-tight">
                {t.innerVisionTitle}
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                {t.innerVisionDesc}
              </p>

              {/* Feature Steps */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-sm">1</div>
                  <span className="text-zinc-300 text-sm">{t.innerVisionFeature1}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-sm">2</div>
                  <span className="text-zinc-300 text-sm">{t.innerVisionFeature2}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-sm">3</div>
                  <span className="text-zinc-300 text-sm">{t.innerVisionFeature3}</span>
                </div>
              </div>

              <a
                href="https://inner-vision-captaloona.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-12 py-5 bg-amber-400 text-zinc-900 tracking-[0.3em] uppercase text-[10px] font-bold hover:bg-amber-300 transition-all shadow-xl mt-4"
              >
                {t.innerVisionBtn}
              </a>
            </div>

            {/* Visual Preview */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl border border-zinc-700">
                {/* Room mockup with art */}
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop"
                  alt="Interior room preview"
                  className="w-full h-full object-cover"
                />
                {/* Overlay artwork simulation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-1/3 aspect-[3/4] shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                    <img
                      src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format&fit=crop"
                      alt="Artwork preview"
                      className="w-full h-full object-cover border-8 border-white shadow-lg"
                    />
                  </div>
                </div>
                {/* Glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent"></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-amber-400/30 rounded-sm"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 border border-amber-400/20 rounded-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Coach Section */}
      <section className="py-40 bg-white border-y border-zinc-50">
        <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                <div className="lg:col-span-5 space-y-10">
                    <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.5em]">ARTS COACH & CURATOR</span>
                    <h2 className="text-6xl serif italic leading-tight">{t.coachTitle}</h2>
                    <p className="text-zinc-500 text-lg leading-relaxed font-light italic">
                        {t.coachDesc}
                    </p>
                    <button
                        onClick={() => onNavigate('/artista')}
                        className="px-12 py-5 border border-zinc-900 text-zinc-900 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-zinc-900 hover:text-white transition-all"
                    >
                        {t.coachBtn}
                    </button>
                </div>
                <div className="lg:col-span-7">
                    <div className="relative aspect-[16/10] overflow-hidden shadow-2xl">
                        <img
                            src={coachImage}
                            alt="Claudio Fiorentini Works"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Exhibition Section */}
      {featuredEvent && (
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">
                PRÓXIMA EXPOSICIÓN
              </span>
              <h2 className="text-5xl md:text-6xl serif italic">
                No te pierdas nuestras exposiciones
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Event Image */}
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
                  <span className="absolute top-4 left-4 z-10 bg-white/90 px-4 py-2 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                    {featuredEvent.date}
                  </span>
                  <img
                    src={featuredEvent.imageUrl}
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Event Info */}
              <div className="space-y-6">
                <h3 className="text-4xl md:text-5xl serif font-normal">
                  {featuredEvent.title}
                </h3>

                {featuredEvent.location && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{featuredEvent.location}</span>
                  </div>
                )}

                <p className="text-zinc-500 text-lg leading-relaxed italic font-light">
                  {featuredEvent.description}
                </p>

                <button
                  onClick={() => onNavigate('/eventos')}
                  className="px-12 py-5 border border-zinc-900 text-zinc-900 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-zinc-900 hover:text-white transition-all"
                >
                  Ver todas las exposiciones
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Grid */}
      <section className="py-40 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-32 space-y-6">
            <h2 className="text-6xl serif italic">{t.featuredTitle}</h2>
            <p className="text-zinc-400 text-[10px] uppercase tracking-[0.5em] font-bold">{t.featuredSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {featuredArtworks.length > 0 ? (
              // Show selected featured artworks from admin
              featuredArtworks.map((artwork) => (
                <div key={artwork.id} className="group cursor-pointer bg-white p-6 shadow-sm border border-zinc-100 hover-lift" onClick={() => onNavigate('/coleccion')}>
                  <div className="relative aspect-square overflow-hidden mb-8 bg-zinc-50">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                  </div>
                  <h3 className="text-2xl serif mb-3 group-hover:text-emerald-600 transition-colors">{artwork.title}</h3>
                  <p className="text-[9px] text-zinc-400 uppercase tracking-[0.3em] font-bold">{artwork.artistName}</p>
                </div>
              ))
            ) : (
              // Fallback to default images when no featured artworks selected
              defaultFeaturedImages.map((url, i) => (
                <div key={i} className="group cursor-pointer bg-white p-6 shadow-sm border border-zinc-100 hover-lift" onClick={() => onNavigate('/coleccion')}>
                  <div className="relative aspect-square overflow-hidden mb-8 bg-zinc-50">
                    <img
                      src={url}
                      alt={`Art piece ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                  </div>
                  <h3 className="text-2xl serif mb-3 group-hover:text-emerald-600 transition-colors">Selección Contemporánea</h3>
                  <p className="text-[9px] text-zinc-400 uppercase tracking-[0.3em] font-bold">Curado por Loona Contemporary</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
