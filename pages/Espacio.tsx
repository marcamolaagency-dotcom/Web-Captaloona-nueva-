
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface EspacioProps {
  lang: Language;
}

const galleryImages = [
  {
    id: 1,
    url: '/images/galeria-1.jpg',
    alt: 'Vista interior de la galería Captaloona Art - Área de trabajo'
  },
  {
    id: 2,
    url: '/images/galeria-2.jpg',
    alt: 'Vista interior de la galería Captaloona Art - Obras en exposición'
  },
  {
    id: 3,
    url: '/images/galeria-3.jpg',
    alt: 'Vista interior de la galería Captaloona Art - Entrada principal'
  },
  {
    id: 4,
    url: '/images/galeria-4.jpg',
    alt: 'Vista interior de la galería Captaloona Art - Estantería con libros y arte'
  },
  {
    id: 5,
    url: '/images/galeria-5.jpg',
    alt: 'Vista interior de la galería Captaloona Art - Zona de exhibición'
  }
];

const Espacio: React.FC<EspacioProps> = ({ lang }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const t = TRANSLATIONS[lang].space;

  return (
    <div className="pt-32 pb-24 animate-fadeIn">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-20">
          <span className="text-emerald-600 text-[11px] font-bold uppercase tracking-[0.6em] block mb-6">
            {t.headquarters}
          </span>
          <h1 className="text-6xl md:text-7xl serif italic leading-none mb-8">
            {t.title}
          </h1>
          <p className="text-zinc-400 text-sm uppercase tracking-[0.3em]">
            {t.address}
          </p>
        </header>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Mission */}
          <div className="bg-zinc-50 p-12 rounded-sm border border-zinc-100 relative">
            <div className="absolute -top-4 left-8 bg-white px-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600">{t.mission}</span>
            </div>
            <p className="text-zinc-600 leading-relaxed text-lg serif italic">
              {t.missionText}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-zinc-900 p-12 rounded-sm relative">
            <div className="absolute -top-4 left-8 bg-white px-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900">{t.vision}</span>
            </div>
            <p className="text-zinc-300 leading-relaxed text-lg mb-6">
              {t.visionIntro}
            </p>
            <p className="text-white text-2xl serif italic">
              {t.visionText}
            </p>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-16">
          <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-12">
            {t.galleryTitle}
          </h2>

          {/* Main Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className={`relative overflow-hidden cursor-pointer group ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <div className={`${index === 0 ? 'aspect-[4/3]' : 'aspect-square'} bg-zinc-200`}>
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center py-16 border-t border-zinc-100">
          <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl mx-auto mb-8">
            {t.galleryDesc}
          </p>
          <div className="flex justify-center gap-8">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">{t.schedule}</h4>
              <p className="text-sm text-zinc-600">{t.scheduleWeekdays}</p>
              <p className="text-sm text-zinc-600">{t.scheduleSaturday}</p>
            </div>
            <div className="h-16 w-px bg-zinc-100" />
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">{t.contact}</h4>
              <p className="text-sm text-zinc-600"><a href="mailto:info@loonacontemporary.com" className="hover:text-emerald-600 transition-colors">info@loonacontemporary.com</a></p>
              <p className="text-sm text-zinc-600">+34 669 61 62 20</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section — AEO: preguntas sobre la galería */}
      <div className="max-w-3xl mx-auto px-6 py-16 border-t border-zinc-100">
        <div className="text-center mb-12">
          <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.5em]">Preguntas frecuentes</span>
          <h2 className="text-3xl serif italic mt-4">Sobre Captaloona Art</h2>
        </div>

        <div className="space-y-0 divide-y divide-zinc-100">
          {[
            {
              q: '¿Dónde está Captaloona Art?',
              a: 'Captaloona Art está en Andrés Mellado 55, barrio Gaztambide, Madrid 28015. Se encuentra en el distrito de Argüelles, a pocos minutos de los metros Islas Filipinas y Argüelles.'
            },
            {
              q: '¿Cuándo está abierta la galería?',
              a: 'Captaloona Art abre de lunes a viernes de 10:00 a 19:00, y los sábados de 11:00 a 14:00. Para visitas concertadas fuera de horario puede contactar en info@loonacontemporary.com o al +34 669 61 62 20.'
            },
            {
              q: '¿Qué tipo de arte expone Captaloona Art?',
              a: 'Captaloona Art expone arte contemporáneo emergente con enfoque filosófico: pintura matérica y polimatérica, neo-expresionismo mediterráneo, obra sobre papel y escultura. Todos los artistas son seleccionados por Claudio Fiorentini siguiendo el criterio de que el arte debe anticipar el pensamiento, no seguirlo.'
            },
            {
              q: '¿Cómo puedo visitar la galería o adquirir una obra?',
              a: 'Puedes visitar Captaloona Art en horario de apertura sin cita previa. Para adquisición de obras o información sobre artistas, escríbenos a info@loonacontemporary.com. También puedes explorar la colección en línea y usar la herramienta Inner Vision para ver cómo quedaría una obra en tu espacio.'
            }
          ].map(({ q, a }, i) => (
            <details key={i} className="group py-6">
              <summary className="flex justify-between items-center cursor-pointer list-none gap-4">
                <h3 className="text-lg font-medium text-zinc-900 group-open:text-emerald-700 transition-colors">{q}</h3>
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-zinc-400 group-open:text-emerald-600 transition-colors">
                  <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-zinc-500 leading-relaxed text-base">{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 text-white text-4xl hover:text-zinc-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <button
            className="absolute left-8 text-white text-4xl hover:text-zinc-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(prev => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null);
            }}
          >
            ‹
          </button>
          <img
            src={galleryImages[selectedImage].url}
            alt={galleryImages[selectedImage].alt}
            className="max-w-full max-h-[80vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-8 text-white text-4xl hover:text-zinc-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(prev => prev !== null ? (prev + 1) % galleryImages.length : null);
            }}
          >
            ›
          </button>
          <div className="absolute bottom-8 text-white text-sm text-center">
            {galleryImages[selectedImage].alt}
          </div>
        </div>
      )}
    </div>
  );
};

export default Espacio;
