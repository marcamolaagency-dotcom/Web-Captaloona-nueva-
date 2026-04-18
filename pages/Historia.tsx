
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { EventItem, OtherEvent, Language, getLocalizedText } from '../types';
import { TRANSLATIONS } from '../translations';
import ImageLightbox from '../components/ImageLightbox';

interface HistoriaProps {
  events: EventItem[];
  otherEvents: OtherEvent[];
  lang: Language;
}

const MONTH_MAP: Record<string, number> = {
  'ENERO': 0, 'FEBRERO': 1, 'MARZO': 2, 'ABRIL': 3, 'MAYO': 4, 'JUNIO': 5,
  'JULIO': 6, 'AGOSTO': 7, 'SEPTIEMBRE': 8, 'OCTUBRE': 9, 'NOVIEMBRE': 10, 'DICIEMBRE': 11,
  'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'JUN': 5,
  'JUL': 6, 'AGO': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11,
  'JAN': 0, 'APR': 3, 'AUG': 7, 'DEC': 11,
};
const MONTH_RE = /\b(ENERO|FEBRERO|MARZO|ABRIL|MAYO|JUNIO|JULIO|AGOSTO|SEPTIEMBRE|OCTUBRE|NOVIEMBRE|DICIEMBRE|ENE|FEB|MAR|ABR|JUN|JUL|AGO|SEP|OCT|NOV|DIC|JAN|APR|AUG|DEC)\b/g;

const parseBoundaryDate = (dateStr: string, boundary: 'start' | 'end'): Date => {
  if (!dateStr) return new Date(0);
  const str = dateStr.trim().toUpperCase();
  const isoMatch = str.match(/^(20\d{2})-(0?\d|1[0-2])-(0?\d|[12]\d|3[01])$/);
  if (isoMatch) return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  const slashMatch = str.match(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/);
  if (slashMatch) return new Date(parseInt(slashMatch[3]), parseInt(slashMatch[2]) - 1, parseInt(slashMatch[1]));
  const yearMatch = str.match(/\b(20\d{2})\b/);
  if (!yearMatch) return new Date(0);
  const year = parseInt(yearMatch[1]);
  const monthMatches = [...str.matchAll(MONTH_RE)].map(m => MONTH_MAP[m[1]]);
  const month = monthMatches.length > 0 ? (boundary === 'end' ? monthMatches[monthMatches.length - 1] : monthMatches[0]) : 0;
  const dayMatches = [...str.matchAll(/\b(\d{1,2})\b/g)].map(m => parseInt(m[1])).filter(n => n >= 1 && n <= 31);
  const day = dayMatches.length > 0 ? (boundary === 'end' ? dayMatches[dayMatches.length - 1] : dayMatches[0]) : 1;
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

const Historia: React.FC<HistoriaProps> = ({ events, otherEvents, lang }) => {
  const t = TRANSLATIONS[lang].historia;
  const [selectedEvent, setSelectedEvent] = useState<CombinedEvent | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const closeDetail = useCallback(() => {
    setSelectedEvent(null);
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDetail(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedEvent, closeDetail]);

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

  const description = selectedEvent ? getLocalizedText(selectedEvent.description, lang) : '';

  return (
    <>
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-20">
            <span className="text-emerald-600 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{t.sectionLabel}</span>
            <h1 className="text-5xl serif">{t.pageTitle}</h1>
            <p className="text-zinc-500 mt-4 text-lg italic">{t.pageSubtitle}</p>
          </header>

          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {pastEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedEvent(ev)}
                >
                  <div className="relative aspect-video overflow-hidden bg-zinc-100 mb-5">
                    <img
                      src={ev.imageUrl}
                      alt={ev.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${ev.type === 'exposicion' ? 'bg-white/90 text-emerald-600' : 'bg-white/90 text-zinc-500'}`}>
                        {ev.type === 'exposicion' ? t.exposition : (ev.category || t.event)}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white/90 px-4 py-2 text-xs font-medium text-zinc-700 shadow-lg">{t.explore} →</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{ev.date}</p>
                    <h3 className="text-xl serif group-hover:text-emerald-600 transition-colors">{ev.title}</h3>
                    {ev.location && <p className="text-xs text-zinc-400">{ev.location}</p>}
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                      {getLocalizedText(ev.description, lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center text-zinc-400 italic">{t.noEvents}</div>
          )}
        </div>
      </div>

      {/* ─── Event Detail Modal ─── */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col animate-fadeIn">

          {/* Header bar */}
          <div className="flex-none flex items-center justify-between px-6 py-4 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
            <button
              onClick={closeDetail}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs uppercase tracking-widest"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              {t.backToHistory}
            </button>
            <h2 className="text-white font-serif italic text-lg hidden sm:block truncate max-w-xs">{selectedEvent.title}</h2>
            <button
              onClick={closeDetail}
              className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              aria-label={t.close}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main content: scrollable on mobile, side-by-side on desktop */}
          <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">

            {/* Image area — fixed height on mobile, fills column on desktop */}
            <div className="relative flex-none md:flex-1 h-[45vh] md:h-auto bg-zinc-950 flex items-center justify-center p-4 md:p-10">
              {selectedEvent.imageUrl ? (
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  className="max-w-full max-h-full object-contain cursor-zoom-in select-none"
                  onClick={() => setLightboxOpen(true)}
                  draggable={false}
                />
              ) : (
                <div className="flex items-center justify-center text-zinc-600">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {selectedEvent.imageUrl && (
                <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/30 text-[10px] hidden md:block pointer-events-none">
                  · clic para zoom ·
                </p>
              )}
            </div>

            {/* Info sidebar */}
            <div className="flex-none md:w-80 lg:w-96 bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800 md:overflow-y-auto">
              <div className="p-8 space-y-6">
                {/* Type badge */}
                <span className={`inline-block text-[9px] font-bold uppercase tracking-[0.3em] px-2 py-1 rounded-sm ${
                  selectedEvent.type === 'exposicion'
                    ? 'bg-emerald-900/50 text-emerald-400'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {selectedEvent.type === 'exposicion' ? t.exposition : (selectedEvent.category || t.event)}
                </span>

                {/* Date */}
                <p className="text-emerald-400 font-serif italic text-lg">{selectedEvent.date}</p>

                {/* Title */}
                <h3 className="text-3xl font-serif italic text-white leading-tight">{selectedEvent.title}</h3>

                {/* Location */}
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedEvent.location}
                  </div>
                )}

                {/* Description */}
                {description && (
                  <>
                    <div className="w-8 h-px bg-zinc-700" />
                    <p className="text-zinc-300 text-sm leading-relaxed">{description}</p>
                  </>
                )}

                {/* Catalog / Video links */}
                {(selectedEvent.catalogUrl || selectedEvent.videoUrl) && (
                  <>
                    <div className="w-8 h-px bg-zinc-700" />
                    <div className="flex flex-col gap-3">
                      {selectedEvent.catalogUrl && (
                        <a
                          href={selectedEvent.catalogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-600 text-[10px] uppercase font-bold tracking-[0.2em] text-white hover:bg-white hover:text-zinc-900 transition-all"
                          onClick={e => e.stopPropagation()}
                        >
                          {t.viewCatalog}
                        </a>
                      )}
                      {selectedEvent.videoUrl && (
                        <a
                          href={selectedEvent.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-emerald-500 transition-all"
                          onClick={e => e.stopPropagation()}
                        >
                          {t.viewVideo}
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image zoom lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        imageUrl={selectedEvent?.imageUrl || ''}
        alt={selectedEvent?.title || ''}
        title={selectedEvent?.title}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};

export default Historia;
