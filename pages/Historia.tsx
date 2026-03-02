
import React, { useMemo, useState } from 'react';
import { EventItem, OtherEvent } from '../types';
import ImageLightbox from '../components/ImageLightbox';

interface HistoriaProps {
  events: EventItem[];
  otherEvents: OtherEvent[];
}

const MONTH_MAP: Record<string, number> = {
  'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'MAY': 4, 'JUN': 5,
  'JUL': 6, 'AGO': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11,
  'JAN': 0, 'APR': 3, 'AUG': 7, 'DEC': 11,
};
const MONTH_RE = /\b(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|OCT|NOV|DIC|JAN|APR|AUG|DEC)\b/g;

const parseBoundaryDate = (dateStr: string, boundary: 'start' | 'end'): Date => {
  const str = dateStr.trim().toUpperCase();
  const yearMatch = str.match(/\b(20\d{2})\b/);
  if (!yearMatch) return new Date(0);
  const year = parseInt(yearMatch[1]);
  const monthMatches = [...str.matchAll(MONTH_RE)].map(m => MONTH_MAP[m[1]]);
  const month = monthMatches.length > 0
    ? (boundary === 'end' ? monthMatches[monthMatches.length - 1] : monthMatches[0])
    : 0;
  const dayMatches = [...str.matchAll(/\b(\d{1,2})\b/g)]
    .map(m => parseInt(m[1]))
    .filter(n => n >= 1 && n <= 31);
  const day = dayMatches.length > 0
    ? (boundary === 'end' ? dayMatches[dayMatches.length - 1] : dayMatches[0])
    : 1;
  return new Date(year, month, day);
};

type CombinedEvent = {
  id: string;
  date: string;
  title: string;
  imageUrl: string;
  description: string;
  type: 'exposicion' | 'otro';
  location?: string;
  catalogUrl?: string;
  videoUrl?: string;
  category?: string;
};

const Historia: React.FC<HistoriaProps> = ({ events, otherEvents }) => {
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const pastEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    const all: CombinedEvent[] = [
      ...events.map(e => ({ ...e, type: 'exposicion' as const })),
      ...otherEvents.map(e => ({ ...e, type: 'otro' as const })),
    ];

    return all
      .filter(e => parseBoundaryDate(e.date, 'end').getTime() < todayMs)
      .sort((a, b) => parseBoundaryDate(b.date, 'start').getTime() - parseBoundaryDate(a.date, 'start').getTime());
  }, [events, otherEvents]);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20">
          <span className="text-emerald-600 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Archivo</span>
          <h1 className="text-5xl serif">Historia</h1>
          <p className="text-zinc-500 mt-4 text-lg italic">Registro de exposiciones y eventos pasados</p>
        </header>

        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {pastEvents.map((ev) => (
              <div key={ev.id} className="group">
                <div
                  className="relative aspect-video overflow-hidden bg-zinc-100 cursor-zoom-in mb-5"
                  onClick={() => setLightboxImage({ url: ev.imageUrl, title: ev.title })}
                >
                  <img
                    src={ev.imageUrl}
                    alt={ev.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${ev.type === 'exposicion' ? 'bg-white/90 text-emerald-600' : 'bg-white/90 text-zinc-500'}`}>
                      {ev.type === 'exposicion' ? 'Exposición' : (ev.category || 'Evento')}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-medium text-zinc-700 shadow-lg">Click para ampliar</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{ev.date}</p>
                  <h3 className="text-xl serif group-hover:text-emerald-600 transition-colors">{ev.title}</h3>
                  {ev.location && <p className="text-xs text-zinc-400">{ev.location}</p>}
                  <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{ev.description}</p>
                  {(ev.catalogUrl || ev.videoUrl) && (
                    <div className="flex gap-3 pt-1 flex-wrap">
                      {ev.catalogUrl && (
                        <a href={ev.catalogUrl} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider border-b border-emerald-200 hover:border-emerald-600 transition-colors">
                          Ver Catálogo
                        </a>
                      )}
                      {ev.videoUrl && (
                        <a href={ev.videoUrl} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider border-b border-emerald-200 hover:border-emerald-600 transition-colors">
                          Ver Video
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center text-zinc-400 italic">
            No hay eventos en el archivo todavía.
          </div>
        )}
      </div>

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

export default Historia;
