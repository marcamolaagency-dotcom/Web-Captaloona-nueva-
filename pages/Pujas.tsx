
import React, { useEffect, useMemo, useState } from 'react';
import { Artwork, Auction, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Countdown from '../components/Countdown';
import BidForm from '../components/BidForm';
import ImageLightbox from '../components/ImageLightbox';

interface PujasProps {
  auctions: Auction[];
  artworks: Artwork[];
  lang: Language;
}

const Pujas: React.FC<PujasProps> = ({ auctions, artworks, lang }) => {
  const t = TRANSLATIONS[lang].pujas;
  const [liveAuctions, setLiveAuctions] = useState<Auction[]>(auctions);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    setLiveAuctions(auctions);
  }, [auctions]);

  // Suscripción en vivo: refleja la puja más alta a todos los visitantes
  // en cuanto place_bid() actualiza la fila, sin recargar la página.
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('auctions-live')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'auctions' },
        (payload) => {
          const updated = payload.new as any;
          setLiveAuctions((prev) =>
            prev.map((a) =>
              a.id === updated.id
                ? {
                    ...a,
                    currentBid: updated.current_bid !== null ? Number(updated.current_bid) : null,
                    currentBidderName: updated.current_bidder_name || null,
                    status: updated.status,
                  }
                : a
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const activeAuctions = useMemo(
    () => liveAuctions.filter((a) => a.status === 'activa' && new Date(a.endDate).getTime() > Date.now()),
    [liveAuctions]
  );

  const findArtwork = (artworkId: string): Artwork | undefined => artworks.find((a) => a.id === artworkId);

  const handleAuctionEnded = (auctionId: string) => {
    setLiveAuctions((prev) => prev.map((a) => (a.id === auctionId ? { ...a, status: 'finalizada' } : a)));
  };

  const selectedAuction = selectedId ? liveAuctions.find((a) => a.id === selectedId) : null;
  const selectedArtwork = selectedAuction ? findArtwork(selectedAuction.artworkId) : null;

  // ── Vista de detalle de una subasta ──
  if (selectedAuction && selectedArtwork) {
    const isActive = selectedAuction.status === 'activa' && new Date(selectedAuction.endDate).getTime() > Date.now();
    const currentAmount = selectedAuction.currentBid ?? selectedAuction.startingPrice;

    return (
      <div className="pt-24 md:pt-32 pb-16 md:pb-24 animate-fadeIn">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <button
            onClick={() => setSelectedId(null)}
            className="mb-8 text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-700 transition-colors"
          >
            ← {t.backToList}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            <div
              className="relative aspect-[3/4] overflow-hidden bg-zinc-100 cursor-zoom-in group"
              onClick={() => setLightboxImage({ url: selectedArtwork.imageUrl, title: selectedArtwork.title })}
            >
              <img
                src={selectedArtwork.imageUrl}
                alt={selectedArtwork.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-3 block">
                  {t.sectionLabel}
                </span>
                <h1 className="text-3xl md:text-4xl serif mb-2">{selectedArtwork.title}</h1>
                <p className="text-zinc-400 italic">{selectedArtwork.artistName}</p>
              </div>

              <div className="bg-zinc-50 p-6 rounded-sm border border-zinc-100 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-widest text-zinc-400">{t.currentBid}</span>
                  <span className="text-3xl serif text-emerald-600">{currentAmount}€</span>
                </div>
                {selectedAuction.currentBidderName && (
                  <p className="text-xs text-zinc-400">
                    {t.highestBidder}: <span className="font-medium text-zinc-600">{selectedAuction.currentBidderName}</span>
                  </p>
                )}
                <div className="flex justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-100">
                  <span>{t.startingPrice}: {selectedAuction.startingPrice}€</span>
                  <span>{t.minIncrement}: +{selectedAuction.minIncrement}€</span>
                </div>
              </div>

              {isActive ? (
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-400 mb-3">{t.timeLeft}</p>
                  <Countdown
                    endDate={selectedAuction.endDate}
                    labels={{ days: t.days, hours: t.hours, minutes: t.minutes, seconds: t.seconds }}
                    onEnd={() => handleAuctionEnded(selectedAuction.id)}
                  />
                </div>
              ) : (
                <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">{t.auctionEnded}</p>
              )}

              {isActive && (
                <BidForm
                  auction={selectedAuction}
                  artworkTitle={selectedArtwork.title}
                  lang={lang}
                  onBidSuccess={({ amount, bidderName }) =>
                    setLiveAuctions((prev) =>
                      prev.map((a) => (a.id === selectedAuction.id ? { ...a, currentBid: amount, currentBidderName: bidderName } : a))
                    )
                  }
                />
              )}
            </div>
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
  }

  // ── Vista de lista ──
  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <header className="mb-10 md:mb-14 text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-4 block">
            {t.sectionLabel}
          </span>
          <h1 className="text-4xl md:text-5xl serif mb-4 md:mb-6">{t.pageTitle}</h1>
          <p className="text-sm md:text-base text-zinc-500 leading-relaxed">{t.pageSubtitle}</p>
        </header>

        {activeAuctions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-10 md:gap-y-20">
            {activeAuctions.map((auction) => {
              const artwork = findArtwork(auction.artworkId);
              if (!artwork) return null;
              const currentAmount = auction.currentBid ?? auction.startingPrice;

              return (
                <div key={auction.id} className="group cursor-pointer" onClick={() => setSelectedId(auction.id)}>
                  <div className="relative aspect-[3/4] mb-5 md:mb-8 overflow-hidden bg-zinc-100">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 md:top-4 md:right-4">
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm bg-white text-emerald-600">
                        {currentAmount}€
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-medium text-zinc-700 shadow-lg">
                        {t.bidNow}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl serif group-hover:text-emerald-600 transition-colors">{artwork.title}</h3>
                    <p className="text-sm text-zinc-400 italic">{artwork.artistName}</p>
                    <div className="pt-3 border-t border-zinc-50 mt-4">
                      <Countdown
                        endDate={auction.endDate}
                        labels={{ days: t.days, hours: t.hours, minutes: t.minutes, seconds: t.seconds }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 md:py-24">
            <p className="text-zinc-400">{t.noActiveAuctions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pujas;
