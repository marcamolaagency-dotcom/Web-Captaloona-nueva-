
import React, { useState } from 'react';
import { submitContactMessage } from '../lib/database';
import { isSupabaseConfigured } from '../lib/supabase';
import { submitContactToGHL, isGHLConfigured } from '../lib/ghl';

const Contacto: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Por favor, completa todos los campos.');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Por favor, introduce un email válido.');
      }

      // Submit to Supabase if configured
      if (isSupabaseConfigured()) {
        const success = await submitContactMessage(
          formData.name,
          formData.email,
          formData.message
        );

        if (!success) {
          throw new Error('Error al enviar el mensaje. Inténtalo de nuevo.');
        }
      }

      // Submit to GHL (GoHighLevel) if configured
      if (isGHLConfigured()) {
        await submitContactToGHL(
          formData.name,
          formData.email,
          formData.message
        );
      }

      // Also submit to Netlify Forms (works even without Supabase)
      const netlifyFormData = new FormData();
      netlifyFormData.append('form-name', 'contact');
      netlifyFormData.append('name', formData.name);
      netlifyFormData.append('email', formData.email);
      netlifyFormData.append('message', formData.message);

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(netlifyFormData as any).toString()
      });

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);

    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl serif mb-6 italic">Hablemos de Arte</h1>
          <p className="text-zinc-500 max-w-xl mx-auto">¿Tienes preguntas sobre alguna obra o estás interesado en realizar una exposición? Estamos aquí para escucharte.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="bg-white p-10 shadow-2xl rounded-sm border border-zinc-50">
            {/* Hidden form for Netlify Forms detection */}
            <form name="contact" netlify-honeypot="bot-field" data-netlify="true" hidden>
              <input type="text" name="name" />
              <input type="email" name="email" />
              <textarea name="message"></textarea>
            </form>

            <form
              name="contact"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Honeypot field for spam protection */}
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>
                  No llenar este campo: <input name="bot-field" />
                </label>
              </p>

              {/* Success message */}
              {status === 'success' && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-sm text-sm animate-fadeIn">
                  ¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.
                </div>
              )}

              {/* Error message */}
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-emerald-600 transition-colors resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-zinc-900 text-white py-4 uppercase tracking-[0.3em] text-sm hover:bg-emerald-600 transition-all duration-500 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>

          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-4 text-emerald-600">Teléfono</h4>
                <a href="tel:+34669616220" className="text-zinc-900 font-medium hover:text-emerald-600 transition-colors">
                  +34 669 61 62 20
                </a>
              </div>
              <div>
                <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-4 text-emerald-600">Email</h4>
                <a href="mailto:info@loonacontemporary.com" className="text-zinc-900 font-medium hover:text-emerald-600 transition-colors">
                  info@loonacontemporary.com
                </a>
              </div>
              <div className="sm:col-span-2">
                <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-4 text-emerald-600">Dirección</h4>
                <a
                  href="https://maps.google.com/?q=Calle+de+Andrés+Mellado+55+28015+Madrid+España"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-900 font-medium leading-relaxed hover:text-emerald-600 transition-colors block"
                >
                  Calle de Andrés Mellado, 55<br />
                  28015 Madrid, España
                </a>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="h-80 bg-zinc-100 relative rounded-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.2!2d-3.7137!3d40.4356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287c5c1b8f8b%3A0x0!2sCalle%20de%20Andr%C3%A9s%20Mellado%2C%2055%2C%2028015%20Madrid!5e0!3m2!1ses!2ses!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Captaloona Art"
                className="grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>

            {/* WhatsApp button */}
            <a
              href="https://wa.me/34669616220?text=Hola,%20me%20gustaría%20más%20información%20sobre%20Captaloona%20Art"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-emerald-600 text-white py-4 px-6 rounded-sm hover:bg-emerald-700 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-sm font-bold uppercase tracking-widest">Contactar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
