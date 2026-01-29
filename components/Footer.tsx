
import React, { useState } from 'react';
import { submitNewsletterToGHL, isGHLConfigured } from '../lib/ghl';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('sending');

    try {
      // Submit to GHL if configured
      if (isGHLConfigured()) {
        await submitNewsletterToGHL(email);
      }

      // Also submit to Netlify Forms as backup
      const netlifyFormData = new FormData();
      netlifyFormData.append('form-name', 'newsletter');
      netlifyFormData.append('email', email);

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(netlifyFormData as any).toString()
      });

      setStatus('success');
      setEmail('');

      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Newsletter submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h3 className="text-3xl font-normal mb-6 serif">Subscríbete a nuestra Newsletter</h3>
            <p className="text-zinc-500 mb-8 max-w-md">Mantente al tanto de nuestras próximas exposiciones, nuevos lanzamientos y eventos exclusivos.</p>
            {/* Hidden form for Netlify Forms detection */}
            <form name="newsletter" data-netlify="true" hidden>
              <input type="email" name="email" />
            </form>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col max-w-md">
              <div className="flex">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  className="flex-1 bg-white border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
                  disabled={status === 'sending'}
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="bg-zinc-900 text-white px-6 py-3 text-sm tracking-widest hover:bg-zinc-800 transition-colors uppercase disabled:opacity-50"
                >
                  {status === 'sending' ? '...' : 'Unirse'}
                </button>
              </div>
              {status === 'success' && (
                <p className="text-emerald-600 text-sm mt-2">Gracias por suscribirte</p>
              )}
              {status === 'error' && (
                <p className="text-red-500 text-sm mt-2">Por favor, introduce un email válido</p>
              )}
            </form>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-zinc-900 mb-4 uppercase tracking-tighter">Explorar</h4>
              <ul className="space-y-2 text-zinc-500">
                <li><a href="#" className="hover:text-emerald-600">Inicio</a></li>
                <li><a href="#" className="hover:text-emerald-600">Artistas</a></li>
                <li><a href="#" className="hover:text-emerald-600">Colección</a></li>
                <li><a href="#" className="hover:text-emerald-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 mb-4 uppercase tracking-tighter">Legal</h4>
              <ul className="space-y-2 text-zinc-500">
                <li><a href="#" className="hover:text-emerald-600">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-emerald-600">Política de Cookies</a></li>
                <li><a href="#" className="hover:text-emerald-600">Términos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 mb-4 uppercase tracking-tighter">Sede Madrid</h4>
              <address className="not-italic space-y-2 text-zinc-500">
                <p>C. de Andrés Mellado, 55</p>
                <p>28015 Madrid, España</p>
                <p>+34 669 61 62 20</p>
                <p><a href="mailto:info@loonacontemporary.com" className="hover:text-emerald-600">info@loonacontemporary.com</a></p>
              </address>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-zinc-200 pt-8 text-xs text-zinc-400 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} CAPTALOONA ART MADRID</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://www.instagram.com/captaloona_art/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600">Instagram</a>
            <a href="https://www.facebook.com/captaloona/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600">Facebook</a>
            <a href="https://www.linkedin.com/in/claudio-fiorentini-12232b" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
