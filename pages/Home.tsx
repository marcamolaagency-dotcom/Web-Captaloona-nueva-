
import React, { useState, useMemo } from 'react';
import { Language, Artwork, EventItem } from '../types.ts';
import { TRANSLATIONS } from '../translations.ts';
import ImageLightbox from '../components/ImageLightbox.tsx';

interface HomeProps {
  onNavigate: (path: string) => void;
  lang: Language;
  artworks: Artwork[];
  featuredArtworkIds: string[];
  events: EventItem[];
}

// Helper function to parse date strings like "24 NOV 2024" to Date objects.
// Always returns a valid Date — never Invalid Date — so filtering never drops events.
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
    if (!isNaN(day) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return new Date(0); // Fallback to epoch so the event still appears as past
};


const Home: React.FC<HomeProps> = ({ onNavigate, lang, artworks, featuredArtworkIds, events }) => {
  const t = TRANSLATIONS[lang]?.home || TRANSLATIONS['ES'].home;
  const [lightboxImage, setLightboxImage] = useState<{url: string; title: string; artist: string} | null>(null);

  // Imagen fija para el panel Arts Coaching & Curaduría
  const coachImage = "/images/baldosas.lr.jpg";

  // Get the most relevant event for the featured exhibition section:
  // - Upcoming events first (closest to today)
  // - If none upcoming, the most recent past event
  const featuredEvent = useMemo(() => {
    if (events.length === 0) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    const upcoming = events
      .filter(e => parseEventDate(e.date).getTime() >= todayMs)
      .sort((a, b) => parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime());
    if (upcoming.length > 0) return upcoming[0];
    const past = events
      .filter(e => parseEventDate(e.date).getTime() < todayMs)
      .sort((a, b) => parseEventDate(b.date).getTime() - parseEventDate(a.date).getTime());
    return past.length > 0 ? past[0] : null;
  }, [events]);

  // Get featured artworks (selected in admin) or fallback to defaults
  const featuredArtworks = useMemo(() =>
    featuredArtworkIds
      .map(id => artworks.find(a => a.id === id))
      .filter((a): a is Artwork => a !== undefined),
    [featuredArtworkIds, artworks]
  );

  // Fallback images if no featured artworks selected
  const defaultFeaturedImages = [
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop"
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-20 pb-12 md:pt-0 md:pb-0">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop"
            alt="Gallery Background"
            className="w-full h-full object-cover opacity-10 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>

        <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl mx-auto pt-16 md:pt-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-normal text-zinc-900 mb-6 md:mb-12 leading-[1.15] serif animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {t.heroTitle}
          </h1>
          <p className="text-base md:text-xl text-zinc-500 mb-8 md:mb-16 max-w-2xl mx-auto leading-relaxed italic font-light animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            {t.heroDesc}
          </p>

          {/* Banner Art Profiler destacado */}
          <div className="animate-fadeIn mt-6 md:mt-12" style={{ animationDelay: '0.6s' }}>
            <div className="bg-zinc-50 border border-zinc-100 p-6 sm:p-10 md:p-14 rounded-sm shadow-sm inline-block w-full max-w-3xl group transition-all hover:shadow-lg">
               <h3 className="text-zinc-900 text-lg sm:text-xl md:text-2xl serif mb-6 md:mb-8 italic">{t.bannerProfiler}</h3>
               <a
                href="https://captaloona-art-profile.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 sm:px-10 md:px-14 py-4 md:py-6 bg-zinc-900 text-white tracking-[0.3em] md:tracking-[0.4em] uppercase text-[9px] md:text-[10px] font-bold hover:bg-emerald-600 transition-all shadow-xl"
               >
                 {t.bannerBtn}
               </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Exhibition Section */}
      {featuredEvent && (
        <section className="py-16 md:py-32 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <div className="text-center mb-10 md:mb-16">
              <span className="text-amber-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 block">
                PRÓXIMA EXPOSICIÓN
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl serif italic text-white">
                No te pierdas nuestras exposiciones
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
              {/* Event Image */}
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
                  <span className="absolute top-3 left-3 md:top-4 md:left-4 z-10 bg-white/90 px-3 py-1.5 md:px-4 md:py-2 text-emerald-600 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                    {featuredEvent.date}
                  </span>
                  <img
                    src={featuredEvent.imageUrl}
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Decorative elements - hidden on mobile */}
                <div className="hidden md:block absolute -bottom-4 -right-4 w-24 h-24 border border-amber-400/30 rounded-sm"></div>
                <div className="hidden md:block absolute -top-4 -left-4 w-16 h-16 border border-amber-400/20 rounded-sm"></div>
              </div>

              {/* Event Info */}
              <div className="space-y-4 md:space-y-6 text-white">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl serif font-normal">
                  {featuredEvent.title}
                </h3>

                {featuredEvent.location && (
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{featuredEvent.location}</span>
                  </div>
                )}

                <p className="text-zinc-400 text-base md:text-lg leading-relaxed italic font-light">
                  {featuredEvent.description}
                </p>

                <button
                  onClick={() => onNavigate('/eventos')}
                  className="px-8 md:px-12 py-4 md:py-5 bg-amber-400 text-zinc-900 tracking-[0.2em] md:tracking-[0.3em] uppercase text-[9px] md:text-[10px] font-bold hover:bg-amber-300 transition-all shadow-xl"
                >
                  Ver todas las exposiciones
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Coach Section */}
      <section className="py-16 md:py-40 bg-white border-y border-zinc-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 items-center">
                <div className="lg:col-span-5 space-y-6 md:space-y-10">
                    <span className="text-emerald-600 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em]">ARTS COACH & CURATOR</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl serif italic leading-tight">{t.coachTitle}</h2>
                    <p className="text-zinc-500 text-base md:text-lg leading-relaxed font-light italic">
                        {t.coachDesc}
                    </p>
                    <button
                        onClick={() => onNavigate('/artista')}
                        className="px-8 md:px-12 py-4 md:py-5 border border-zinc-900 text-zinc-900 text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase font-bold hover:bg-zinc-900 hover:text-white transition-all"
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
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="py-16 md:py-40 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-32 space-y-4 md:space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl serif italic">{t.featuredTitle}</h2>
            <p className="text-zinc-400 text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-bold">{t.featuredSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-16">
            {featuredArtworks.length > 0 ? (
              // Show selected featured artworks from admin
              featuredArtworks.map((artwork) => (
                <div key={artwork.id} className="group bg-white p-6 shadow-sm border border-zinc-100 hover-lift">
                  <div
                    className="relative aspect-square overflow-hidden mb-8 bg-zinc-50 cursor-zoom-in"
                    onClick={() => setLightboxImage({url: artwork.imageUrl, title: artwork.title, artist: artwork.artistName})}
                  >
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      loading="lazy"
                    />
                    {/* Zoom indicator */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-medium text-zinc-700 shadow-lg">
                        Click para ampliar
                      </span>
                    </div>
                  </div>
                  <h3
                    className="text-2xl serif mb-3 hover:text-emerald-600 transition-colors cursor-pointer"
                    onClick={() => onNavigate('/coleccion')}
                  >
                    {artwork.title}
                  </h3>
                  <p className="text-[9px] text-zinc-400 uppercase tracking-[0.3em] font-bold">{artwork.artistName}</p>
                </div>
              ))
            ) : (
              // Fallback to default images when no featured artworks selected
              defaultFeaturedImages.map((url, i) => (
                <div key={i} className="group bg-white p-6 shadow-sm border border-zinc-100 hover-lift">
                  <div
                    className="relative aspect-square overflow-hidden mb-8 bg-zinc-50 cursor-zoom-in"
                    onClick={() => setLightboxImage({url, title: 'Selección Contemporánea', artist: 'Curado por Loona Contemporary'})}
                  >
                    <img
                      src={url}
                      alt={`Art piece ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      loading="lazy"
                    />
                    {/* Zoom indicator */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-medium text-zinc-700 shadow-lg">
                        Click para ampliar
                      </span>
                    </div>
                  </div>
                  <h3
                    className="text-2xl serif mb-3 hover:text-emerald-600 transition-colors cursor-pointer"
                    onClick={() => onNavigate('/coleccion')}
                  >
                    Selección Contemporánea
                  </h3>
                  <p className="text-[9px] text-zinc-400 uppercase tracking-[0.3em] font-bold">Curado por Loona Contemporary</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Inner Vision Section - Visualizador de Arte */}
      <section className="py-16 md:py-32 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Content */}
            <div className="space-y-6 md:space-y-8 text-white order-2 lg:order-1">
              <span className="text-amber-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em]">
                {t.innerVisionLabel}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl serif italic leading-tight">
                {t.innerVisionTitle}
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                {t.innerVisionDesc}
              </p>

              {/* Feature Steps */}
              <div className="flex flex-col gap-4 md:flex-row md:gap-6 pt-2 md:pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-xs md:text-sm flex-shrink-0">1</div>
                  <span className="text-zinc-300 text-xs md:text-sm">{t.innerVisionFeature1}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-xs md:text-sm flex-shrink-0">2</div>
                  <span className="text-zinc-300 text-xs md:text-sm">{t.innerVisionFeature2}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-xs md:text-sm flex-shrink-0">3</div>
                  <span className="text-zinc-300 text-xs md:text-sm">{t.innerVisionFeature3}</span>
                </div>
              </div>

              <a
                href="https://inner-vision-captaloona.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 md:px-12 py-4 md:py-5 bg-amber-400 text-zinc-900 tracking-[0.2em] md:tracking-[0.3em] uppercase text-[9px] md:text-[10px] font-bold hover:bg-amber-300 transition-all shadow-xl mt-2 md:mt-4"
              >
                {t.innerVisionBtn}
              </a>
            </div>

            {/* Visual Preview */}
            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl border border-zinc-700">
                {/* Room mockup with art */}
                <img
                  src="/images/Innervision-home.jpg"
                  alt="Visualiza el arte en tu espacio"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent"></div>
              </div>

              {/* Decorative elements - hidden on mobile */}
              <div className="hidden md:block absolute -bottom-4 -right-4 w-24 h-24 border border-amber-400/30 rounded-sm"></div>
              <div className="hidden md:block absolute -top-4 -left-4 w-16 h-16 border border-amber-400/20 rounded-sm"></div>
            </div>
          </div>
        </div>
      </section>

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

export default Home;
