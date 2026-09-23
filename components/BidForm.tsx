import React, { useState } from 'react';
import { Auction, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { placeBid } from '../lib/database';
import { submitBidToGHL } from '../lib/ghl';

interface BidFormProps {
  auction: Auction;
  artworkTitle: string;
  lang: Language;
  onBidSuccess: (result: { amount: number; bidderName: string }) => void;
}

const BidForm: React.FC<BidFormProps> = ({ auction, artworkTitle, lang, onBidSuccess }) => {
  const t = TRANSLATIONS[lang].pujas;
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', amount: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const minValid = (auction.currentBid ?? auction.startingPrice) + auction.minIncrement;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const amount = Number(formData.amount);

    if (!formData.name || !formData.email || !amount) {
      setStatus('error');
      setErrorMessage(t.formErrorRequired);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setErrorMessage(t.formErrorEmail);
      return;
    }

    const result = await placeBid({
      auctionId: auction.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      amount,
    });

    if ('message' in result) {
      setStatus('error');
      setErrorMessage(result.message);
      return;
    }

    // Notificar a GHL solo tras la confirmación real de la puja (fire-and-forget)
    submitBidToGHL({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      amount,
      artworkTitle,
      auctionId: auction.id,
    }).catch(() => {});

    setStatus('success');
    onBidSuccess({ amount, bidderName: formData.name });
    setFormData({ name: '', email: '', phone: '', amount: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-sm text-sm animate-fadeIn">
          {t.formSuccess}
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">
          {errorMessage}
        </div>
      )}

      <p className="text-xs text-zinc-400 uppercase tracking-widest">
        {t.minAmountHint} {minValid}€
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="bid-name" className="text-xs font-bold uppercase tracking-widest text-zinc-400">{t.formName}</label>
          <input
            type="text" id="bid-name" name="name" value={formData.name} onChange={handleChange} required
            className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-emerald-600 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="bid-email" className="text-xs font-bold uppercase tracking-widest text-zinc-400">{t.formEmail}</label>
          <input
            type="email" id="bid-email" name="email" value={formData.email} onChange={handleChange} required
            className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-emerald-600 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="bid-phone" className="text-xs font-bold uppercase tracking-widest text-zinc-400">{t.formPhone}</label>
          <input
            type="tel" id="bid-phone" name="phone" value={formData.phone} onChange={handleChange}
            className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-emerald-600 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="bid-amount" className="text-xs font-bold uppercase tracking-widest text-zinc-400">{t.formAmount}</label>
          <input
            type="number" id="bid-amount" name="amount" value={formData.amount} onChange={handleChange}
            min={minValid} step="1" required
            className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-emerald-600 transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-zinc-900 text-white py-4 uppercase tracking-[0.3em] text-sm hover:bg-emerald-600 transition-all duration-500 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? t.formSending : t.formSubmit}
      </button>
    </form>
  );
};

export default BidForm;
