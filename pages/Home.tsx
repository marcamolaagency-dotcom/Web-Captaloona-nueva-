
import React from 'react';
import { Language } from '../types.ts';
import { TRANSLATIONS } from '../translations.ts';

const Home: React.FC<{ onNavigate: (path: string) => void, lang: Language }> = ({ onNavigate, lang }) => {
  const t = TRANSLATIONS[lang]?.home || TRANSLATIONS['ES'].home;

  const featuredImages = [
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
                        Trayectoria de Claudio
                    </button>
                </div>
                <div className="lg:col-span-7">
                    <div className="relative aspect-[16/10] overflow-hidden shadow-2xl">
                        <img 
                            src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200" 
                            alt="Claudio Fiorentini Works" 
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="py-40 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-32 space-y-6">
            <h2 className="text-6xl serif italic">{t.featuredTitle}</h2>
            <p className="text-zinc-400 text-[10px] uppercase tracking-[0.5em] font-bold">{t.featuredSub}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {featuredImages.map((url, i) => (
              <div key={i} className="group cursor-pointer bg-white p-6 shadow-sm border border-zinc-100 hover-lift">
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
