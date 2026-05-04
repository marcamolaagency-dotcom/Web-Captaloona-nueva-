
import React, { useState, useMemo } from 'react';
import { Artwork, Artist, Language, getLocalizedText } from '../types';
import { TRANSLATIONS } from '../translations';

interface PoetryHubProps {
  artists: Artist[];
  artworks: Artwork[];
  lang: Language;
}

const PoetryHub: React.FC<PoetryHubProps> = ({ artists, artworks, lang }) => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [expandedPoem, setExpandedPoem] = useState<string | null>(null);

  const t = TRANSLATIONS[lang].poetryHub;

  // Only poems
  const poems = useMemo(
    () => artworks.filter((a) => a.category === 'Poesía'),
    [artworks]
  );

  // Poets: artists that have at least one poem
  const poets = useMemo(() => {
    const poetIds = new Set(poems.map((p) => p.artistId));
    const fromArtists = artists.filter((a) => poetIds.has(a.id));
    const fromArtistsIds = new Set(fromArtists.map((a) => a.id));

    // Include poets not in the artists table (only in artworks)
    const extra: Artist[] = [];
    poems.forEach((p) => {
      if (!fromArtistsIds.has(p.artistId)) {
        if (!extra.find((a) => a.id === p.artistId)) {
          extra.push({
            id: p.artistId,
            name: p.artistName,
            bio: '',
            imageUrl: 'https://images.unsplash.com/photo-1512253022256-19f4cb92a4dc?q=80&w=800&auto=format&fit=crop',
            location: '',
          });
        }
      }
    });

    return [...fromArtists, ...extra];
  }, [artists, poems]);

  const poetPoems = (artistId: string) =>
    poems.filter(
      (p) =>
        p.artistId === artistId ||
        p.artistName.toLowerCase() ===
          poets.find((a) => a.id === artistId)?.name.toLowerCase()
    );

  // ─── Artist detail view ───────────────────────────────────────────────────
  if (selectedArtist) {
    const works = poetPoems(selectedArtist.id);

    return (
      <div className="min-h-screen bg-zinc-950 text-white animate-fadeIn">
        {/* Header band */}
        <div className="pt-24 md:pt-32 pb-10 px-4 md:px-8 max-w-6xl mx-auto">
          <button
            onClick={() => {
              setSelectedArtist(null);
              setExpandedPoem(null);
            }}
            className="mb-10 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400 flex items-center gap-2 hover:text-emerald-300 transition-colors"
          >
            ← {t.backToPoets}
          </button>

          {/* Artist bio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-24">
            <div className="relative">
              <div className="hidden md:block absolute -top-4 -left-4 w-full h-full border border-emerald-800/40"></div>
              <img
                src={selectedArtist.imageUrl}
                alt={selectedArtist.name}
                className="relative z-10 w-full aspect-square object-cover shadow-2xl"
              />
            </div>
            <div className="space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-400">
                {t.poet}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl serif text-white leading-tight">
                {selectedArtist.name}
              </h1>
              {selectedArtist.location && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {selectedArtist.location}
                </p>
              )}
              {selectedArtist.bio && (
                <p className="text-zinc-400 leading-relaxed text-base md:text-lg">
                  {getLocalizedText(selectedArtist.bio, lang)}
                </p>
              )}
              <div className="pt-4 border-t border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {works.length} {works.length === 1 ? t.poem : t.poems}
                </span>
              </div>
            </div>
          </div>

          {/* Poems */}
          {works.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl serif text-white mb-10 pb-5 border-b border-zinc-800">
                {t.worksBy} {selectedArtist.name}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {works.map((poem) => {
                  const isExpanded = expandedPoem === poem.id;
                  const hasLongText = poem.medium && poem.medium.length > 300;
                  return (
                    <div
                      key={poem.id}
                      className="bg-zinc-900 border border-zinc-800 hover:border-emerald-800/60 transition-all duration-500 rounded-sm p-6 md:p-10 flex flex-col"
                    >
                      {/* Poem header */}
                      <div className="mb-6">
                        {poem.size && (
                          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-400 mb-2 block">
                            {poem.size}
                          </span>
                        )}
                        <h3 className="text-xl md:text-2xl serif text-white leading-tight">
                          {poem.title}
                        </h3>
                        {poem.style && (
                          <p className="text-xs text-zinc-500 mt-2 italic">
                            {poem.style}
                          </p>
                        )}
                      </div>

                      {/* Decorative rule */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-px flex-1 bg-zinc-800"></div>
                        <span className="text-zinc-700 text-sm">✦</span>
                        <div className="h-px flex-1 bg-zinc-800"></div>
                      </div>

                      {/* Poem body */}
                      {poem.medium && (
                        <div className="flex-1">
                          <p
                            className={`text-zinc-300 leading-loose text-sm md:text-base font-light whitespace-pre-wrap serif ${
                              !isExpanded && hasLongText ? 'line-clamp-[10]' : ''
                            }`}
                          >
                            {poem.medium}
                          </p>
                          {hasLongText && (
                            <button
                              onClick={() =>
                                setExpandedPoem(isExpanded ? null : poem.id)
                              }
                              className="mt-4 text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              {isExpanded ? t.collapse : t.readFull}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Optional decorative image */}
                      {poem.imageUrl &&
                        !poem.imageUrl.includes('unsplash') && (
                          <img
                            src={poem.imageUrl}
                            alt={poem.title}
                            className="mt-6 w-full aspect-video object-cover opacity-60"
                          />
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {works.length === 0 && (
            <p className="text-zinc-600 text-center py-16">{t.noPoems}</p>
          )}
        </div>
      </div>
    );
  }

  // ─── Poets grid ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 text-white animate-fadeIn">
      {/* Hero */}
      <div className="relative pt-32 md:pt-44 pb-20 md:pb-32 px-4 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950"></div>
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.5) 60px, rgba(255,255,255,0.5) 61px)',
            }}
          ></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-emerald-400 mb-6 block">
            LOONA CONTEMPORARY
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl serif text-white mb-6 leading-none">
            Poetry Hub
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-emerald-700/50"></div>
            <span className="text-zinc-600 text-sm">✦</span>
            <div className="h-px w-16 bg-emerald-700/50"></div>
          </div>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {t.heroDesc}
          </p>
        </div>
      </div>

      {/* Poets grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24 md:pb-32">
        {poets.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-600">{t.noPoets}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">
                {poets.length} {poets.length === 1 ? t.poet : t.poetsLabel}
              </span>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {poets.map((poet) => {
                const count = poetPoems(poet.id).length;
                return (
                  <button
                    key={poet.id}
                    onClick={() => setSelectedArtist(poet)}
                    className="group text-left bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-700/50 hover:shadow-2xl hover:shadow-emerald-950/50 transition-all duration-500 rounded-sm overflow-hidden"
                  >
                    {/* Photo */}
                    <div className="aspect-[3/2] overflow-hidden bg-zinc-800 relative">
                      <img
                        src={poet.imageUrl}
                        alt={poet.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-4 right-4 bg-emerald-600/90 backdrop-blur-sm px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white">
                          {count} {count === 1 ? t.poem : t.poems}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6 md:p-8">
                      <h2 className="text-xl md:text-2xl serif text-white mb-1 group-hover:text-emerald-300 transition-colors">
                        {poet.name}
                      </h2>
                      {poet.location && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">
                          {poet.location}
                        </p>
                      )}
                      {poet.bio && (
                        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3 mt-2">
                          {getLocalizedText(poet.bio, lang)}
                        </p>
                      )}
                      <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 group-hover:text-emerald-300 transition-colors">
                          {t.readPoems} →
                        </span>
                        <span className="text-[10px] text-zinc-600">
                          {count} {count === 1 ? t.poem : t.poems}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PoetryHub;
