
import React from 'react';
import { Language } from '../types.ts';
import { TRANSLATIONS } from '../translations.ts';

const Artista: React.FC<{ lang?: Language }> = ({ lang = 'ES' }) => {
  const t = TRANSLATIONS[lang].artist;

  return (
    <div className="pt-40 pb-32 max-w-7xl mx-auto px-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-40">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -top-10 -left-10 w-full h-full border border-emerald-100 z-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" 
            alt="Claudio Fiorentini" 
            className="relative z-10 w-full h-auto shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>
        <div className="order-1 lg:order-2 space-y-12">
          <div className="space-y-4">
            <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.5em]">{t.subtitle}</span>
            <h1 className="text-8xl serif italic leading-tight">{t.title}</h1>
          </div>
          
          <div className="h-0.5 w-32 bg-emerald-600"></div>
          
          <p className="text-zinc-500 text-2xl leading-relaxed italic font-light">
            {t.bio}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t border-zinc-100">
            <div className="space-y-4">
              <h4 className="font-bold text-zinc-900 uppercase text-[10px] tracking-widest">{t.disciplines}</h4>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">Pintura Matérica, Poesía Visual, Narrativa Introspectiva.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-zinc-900 uppercase text-[10px] tracking-widest">{t.coachRole}</h4>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">{t.coachDesc}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-zinc-950 text-white p-20 md:p-32 rounded-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/10 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-5xl md:text-7xl serif italic leading-tight">"El arte no persigue, el arte anticipa."</h2>
            <div className="h-0.5 w-20 bg-emerald-500 mx-auto"></div>
            <p className="text-zinc-400 text-lg font-light tracking-widest uppercase">FILOSOFÍA LOONA CONTEMPORARY</p>
        </div>
      </section>
    </div>
  );
};

export default Artista;
