
import React from 'react';
import { EventItem } from '../types';

interface EventosProps {
  events: EventItem[];
}

const Eventos: React.FC<EventosProps> = ({ events }) => {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20">
          <span className="text-emerald-600 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Agenda Cultural</span>
          <h1 className="text-5xl serif">Próximos Eventos</h1>
        </header>

        <div className="space-y-24">
          {events.map((ev, idx) => (
            <div key={ev.id} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
              <div className="flex-1 w-full">
                <div className="relative overflow-hidden aspect-video">
                  <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <span className="text-xl serif italic text-emerald-600">{ev.date}</span>
                <h2 className="text-4xl serif">{ev.title}</h2>
                <div className="flex items-center gap-2 text-zinc-400 text-sm uppercase tracking-widest font-bold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {ev.location}
                </div>
                <p className="text-zinc-500 leading-relaxed text-lg">
                  {ev.description}
                </p>
                <button className="px-10 py-4 border border-zinc-900 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-all">
                  Más Información
                </button>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="py-40 text-center text-zinc-400 italic">
              No hay eventos programados en este momento. Vuelve pronto.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Eventos;
