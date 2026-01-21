
import React from 'react';
import { OtherEvent } from '../types';

interface OtrosEventosProps {
  events: OtherEvent[];
}

const OtrosEventos: React.FC<OtrosEventosProps> = ({ events }) => {
  return (
    <div className="pt-40 pb-32 max-w-7xl mx-auto px-8 animate-fadeIn">
      <header className="mb-24 text-center">
        <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.6em] mb-6 block">COMMUNITY & CULTURE</span>
        <h1 className="text-6xl serif italic">Otros Eventos</h1>
        <p className="text-zinc-400 text-lg font-light mt-8 max-w-2xl mx-auto italic">
          Descubre talleres, charlas, presentaciones de libros y encuentros culturales que dan vida a nuestro espacio más allá de las exposiciones.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {events.map((ev) => (
          <div key={ev.id} className="group cursor-pointer hover-lift">
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50 mb-8 shadow-sm group-hover:shadow-xl transition-all">
              <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-emerald-600">
                {ev.category}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{ev.date}</p>
              <h3 className="text-2xl serif group-hover:text-emerald-600 transition-colors">{ev.title}</h3>
              <p className="text-zinc-500 text-sm font-light leading-relaxed line-clamp-3 italic">
                {ev.description}
              </p>
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-zinc-200 pb-1 pt-4 group-hover:border-emerald-600 transition-all">
                Ver Detalles
              </button>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-zinc-200 rounded-lg">
            <p className="text-zinc-400 italic font-light">No hay eventos próximos programados. Suscríbete para recibir novedades.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtrosEventos;
