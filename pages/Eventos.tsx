
import React, { useMemo, useState } from 'react';
import { EventItem, OtherEvent, Language, getLocalizedText } from '../types';
import ImageLightbox from '../components/ImageLightbox';

interface EventosProps {
  events: EventItem[];
  otherEvents: OtherEvent[];
  lang: Language;
}

// Soporta fechas simples ("21 MAR 2026") y rangos ("10 - 21 MAR 2026", "10 AL 21 ABR 2026", etc.)
// boundary='end'   → fecha final del rango (para filtrar si el evento ya terminó)
// boundary='start' → fecha de inicio (para ordenar por proximidad)
const MONTH_MAP: Record<string, number> = {
  // Nombres completos en español
  'ENERO': 0, 'FEBRERO': 1, 'MARZO': 2, 'ABRIL': 3, 'MAYO': 4, 'JUNIO': 5,
  'JULIO': 6, 'AGOSTO': 7, 'SEPTIEMBRE': 8, 'OCTUBRE': 9, 'NOVIEMBRE': 10, 'DICIEMBRE': 11,
  // Abreviaturas en español e inglés
  'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'JUN': 5,
  'JUL': 6, 'AGO': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11,
  'JAN': 0, 'APR': 3, 'AUG': 7, 'DEC': 11,
};
// Nombres completos primero para que matchAll no capture solo el prefijo de 3 letras
const MONTH_RE = /\b(ENERO|FEBRERO|MARZO|ABRIL|MAYO|JUNIO|JULIO|AGOSTO|SEPTIEMBRE|OCTUBRE|NOVIEMBRE|DICIEMBRE|ENE|FEB|MAR|ABR|JUN|JUL|AGO|SEP|OCT|NOV|DIC|JAN|APR|AUG|DEC)\b/g;

const parseBoundaryDate = (dateStr: string, boundary: 'start' | 'end'): Date => {
  if (!dateStr) return new Date(0);
  const str = dateStr.trim().toUpperCase();

  // ISO: "2024-11-15"
  const isoMatch = str.match(/^(20\d{2})-(0?\d|1[0-2])-(0?\d|[12]\d|3[01])$/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  }

  // Barras: "15/11/2024"
  const slashMatch = str.match(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/);
  if (slashMatch) {
    return new Date(parseInt(slashMatch[3]), parseInt(slashMatch[2]) - 1, parseInt(slashMatch[1]));
  }

  // Formato con nombres/abreviaturas: "15 NOV 2024", "noviembre 2024", "10 AL 20 NOV 2024"
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

const Eventos: React.FC<EventosProps> = ({ events, otherEvents, lang }) => {
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    const all: CombinedEvent[] = [
      ...events.map(e => ({ ...e, type: 'exposicion' as const })),
      ...otherEvents.map(e => ({ ...e, type: 'otro' as const })),
    ];

    return all
      .filter(e => parseBoundaryDate(e.date, 'end').getTime() >= todayMs)
      .sort((a, b) => parseBoundaryDate(a.date, 'start').getTime() - parseBoundaryDate(b.date, 'start').getTime());
  }, [events, otherEvents]);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20">
          <span className="text-emerald-600 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Agenda Cultural</span>
          <h1 className="text-5xl serif">Eventos</h1>
          <p className="text-zinc-500 mt-4 text-lg italic">Exposiciones, talleres y encuentros culturales</p>
        </header>

        <div className="space-y-24">
          {upcomingEvents.map((ev, idx) => (
            <div key={ev.id} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
              <div className="flex-1 w-full">
                <div
                  className="relative overflow-hidden aspect-video cursor-zoom-in group"
                  onClick={() => setLightboxImage({ url: ev.imageUrl, title: ev.title })}
                >
                  <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-medium text-zinc-700 shadow-lg">Click para ampliar</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xl serif italic text-emerald-600">{ev.date}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${ev.type === 'exposicion' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                    {ev.type === 'exposicion' ? 'Exposición' : (ev.category || 'Evento')}
                  </span>
                </div>
                <h2 className="text-4xl serif">{ev.title}</h2>
                {ev.location && (
                  <div className="flex items-center gap-2 text-zinc-400 text-sm uppercase tracking-widest font-bold">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {ev.location}
                  </div>
                )}
                <p className="text-zinc-500 leading-relaxed text-lg">{getLocalizedText(ev.description, lang)}</p>
                {(ev.catalogUrl || ev.videoUrl) && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {ev.catalogUrl && (
                      <a href={ev.catalogUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-900 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-all">
                        Ver Catálogo
                      </a>
                    )}
                    {ev.videoUrl && (
                      <a href={ev.videoUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-emerald-700 transition-all">
                        Ver Video
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {upcomingEvents.length === 0 && (
            <div className="py-40 text-center text-zinc-400 italic">
              No hay eventos programados en este momento. Vuelve pronto.
            </div>
          )}
        </div>
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

export default Eventos;
