
import React, { useState } from 'react';
import { EventItem } from '../types';
import ImageLightbox from '../components/ImageLightbox';

interface EventosProps {
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
  return new Date(0); // Return epoch if parsing fails
};

const Eventos: React.FC<EventosProps> = ({ events }) => {
  const [lightboxImage, setLightboxImage] = useState<{url: string; title: string} | null>(null);

  // Sort events by date: most recent/upcoming first
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = parseEventDate(a.date);
    const dateB = parseEventDate(b.date);
    return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
  });

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20">
          <span className="text-emerald-600 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Agenda Cultural</span>
          <h1 className="text-5xl serif">Exposiciones</h1>
          <p className="text-zinc-500 mt-4 text-lg italic">No te pierdas nuestras exposiciones</p>
        </header>

        <div className="space-y-24">
          {sortedEvents.map((ev, idx) => (
            <div key={ev.id} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
              <div className="flex-1 w-full">
                <div
                  className="relative overflow-hidden aspect-video cursor-zoom-in group"
                  onClick={() => setLightboxImage({url: ev.imageUrl, title: ev.title})}
                >
                  <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  {/* Zoom indicator */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-medium text-zinc-700 shadow-lg">
                      Click para ampliar
                    </span>
                  </div>
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

          {sortedEvents.length === 0 && (
            <div className="py-40 text-center text-zinc-400 italic">
              No hay eventos programados en este momento. Vuelve pronto.
            </div>
          )}
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={!!lightboxImage}
        imageUrl={lightboxImage?.url || ''}
        alt={lightboxImage?.title || ''}
        title={lightboxImage?.title}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
};

export default Eventos;
