
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

const STORAGE_KEY = 'captaloona_cookie_consent';

type ConsentValue = 'accepted' | 'rejected' | null;

interface Props {
  lang: Language;
}

const TEXTS: Record<Language, {
  message: string;
  details: string;
  acceptAll: string;
  rejectNonEssential: string;
  learnMore: string;
}> = {
  ES: {
    message: 'Utilizamos cookies para mejorar tu experiencia en este sitio.',
    details: 'Las cookies esenciales son necesarias para el funcionamiento del sitio. Las cookies analíticas (Google Analytics) nos ayudan a entender cómo interactúas con nuestra web. Puedes aceptarlas todas o rechazar las no esenciales.',
    acceptAll: 'Aceptar todo',
    rejectNonEssential: 'Solo esenciales',
    learnMore: 'Política de cookies',
  },
  EN: {
    message: 'We use cookies to enhance your experience on this site.',
    details: 'Essential cookies are necessary for the site to function. Analytics cookies (Google Analytics) help us understand how you interact with our website. You can accept all or reject non-essential ones.',
    acceptAll: 'Accept all',
    rejectNonEssential: 'Essential only',
    learnMore: 'Cookie policy',
  },
  FR: {
    message: 'Nous utilisons des cookies pour améliorer votre expérience sur ce site.',
    details: 'Les cookies essentiels sont nécessaires au fonctionnement du site. Les cookies analytiques (Google Analytics) nous aident à comprendre comment vous interagissez avec notre site. Vous pouvez tout accepter ou refuser les non essentiels.',
    acceptAll: 'Tout accepter',
    rejectNonEssential: 'Essentiels uniquement',
    learnMore: 'Politique des cookies',
  },
  IT: {
    message: 'Utilizziamo i cookie per migliorare la tua esperienza su questo sito.',
    details: 'I cookie essenziali sono necessari per il funzionamento del sito. I cookie analitici (Google Analytics) ci aiutano a capire come interagisci con il nostro sito. Puoi accettarli tutti o rifiutare quelli non essenziali.',
    acceptAll: 'Accetta tutto',
    rejectNonEssential: 'Solo essenziali',
    learnMore: 'Cookie policy',
  },
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const CookieConsent: React.FC<Props> = ({ lang }) => {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentValue | null;
    if (stored === 'accepted' || stored === 'rejected') {
      setConsent(stored);
      // Restore GA consent on reload
      if (stored === 'accepted') {
        window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
      }
    } else {
      // First visit — show banner after small delay for better UX
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setConsent('accepted');
    setVisible(false);
    window.gtag?.('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
    });
  };

  const handleReject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    setConsent('rejected');
    setVisible(false);
    window.gtag?.('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
    });
  };

  if (consent !== null || !visible) return null;

  const t = TEXTS[lang] || TEXTS['ES'];

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        background: '#ffffff',
        borderTop: '1px solid #e4e4e7',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
        animation: 'cookieSlideUp 0.35s cubic-bezier(0.4,0,0.2,1) forwards',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <style>{`
        @keyframes cookieSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        {/* Text block */}
        <div style={{ flex: '1 1 340px' }}>
          <p style={{ fontSize: '14px', color: '#18181b', marginBottom: '4px', fontWeight: 600 }}>
            🍪 {t.message}
          </p>

          {expanded && (
            <p style={{ fontSize: '13px', color: '#52525b', marginTop: '6px', lineHeight: 1.6 }}>
              {t.details}
            </p>
          )}

          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontSize: '12px',
              color: '#059669',
              textDecoration: 'underline',
              marginTop: '4px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {expanded ? '▲ ' : '▼ '}{t.learnMore}
          </button>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleReject}
            style={{
              padding: '9px 20px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.06em',
              fontWeight: 600,
              textTransform: 'uppercase',
              background: 'transparent',
              color: '#52525b',
              border: '1px solid #d4d4d8',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#18181b';
              (e.currentTarget as HTMLButtonElement).style.color = '#18181b';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#d4d4d8';
              (e.currentTarget as HTMLButtonElement).style.color = '#52525b';
            }}
          >
            {t.rejectNonEssential}
          </button>

          <button
            onClick={handleAccept}
            style={{
              padding: '9px 20px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.06em',
              fontWeight: 600,
              textTransform: 'uppercase',
              background: '#059669',
              color: '#ffffff',
              border: '1px solid #059669',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#047857';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#059669';
            }}
          >
            {t.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
