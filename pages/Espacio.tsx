
import React, { useState } from 'react';

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

const Espacio: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <div className="pt-32 pb-24 animate-fadeIn">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-20">
          <span className="text-emerald-600 text-[11px] font-bold uppercase tracking-[0.6em] block mb-6">
            MADRID HEADQUARTERS
          </span>
          <h1 className="text-6xl md:text-7xl serif italic leading-none mb-8">
            Captaloona Art
          </h1>
          <p className="text-zinc-400 text-sm uppercase tracking-[0.3em]">
            Andrés Mellado 55 · Gaztambide, 28015 · Madrid, España
          </p>
        </header>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Mission */}
          <div className="bg-zinc-50 p-12 rounded-sm border border-zinc-100 relative">
            <div className="absolute -top-4 left-8 bg-white px-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600">Misión</span>
            </div>
            <p className="text-zinc-600 leading-relaxed text-lg serif italic">
              De las exposiciones que se organizan emerge una selección rigurosa de artistas contemporáneos que,
              a través de su arte, indican un recorrido que nos permite acceder al lenguaje artístico del futuro,
              que se expresa con un gesto creativo del presente.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-zinc-900 p-12 rounded-sm relative">
            <div className="absolute -top-4 left-8 bg-white px-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900">Visión</span>
            </div>
            <p className="text-zinc-300 leading-relaxed text-lg mb-6">
              Nuestra idea tiene fundamento en un concepto:
            </p>
            <p className="text-white text-2xl serif italic">
              ¡El arte no persigue, el arte anticipa!
            </p>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-16">
          <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-12">
            Nuestro Espacio
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
            Captaloona Art es el laboratorio físico donde las teorías de Loona Contemporary se materializan.
            Un espacio dedicado a la exploración artística y al encuentro entre artistas y coleccionistas.
          </p>
          <div className="flex justify-center gap-8">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Horario</h4>
              <p className="text-sm text-zinc-600">Lun - Vie: 10:00 - 19:00</p>
              <p className="text-sm text-zinc-600">Sáb: 11:00 - 14:00</p>
            </div>
            <div className="h-16 w-px bg-zinc-100" />
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Contacto</h4>
              <p className="text-sm text-zinc-600">info@captaloonaart.com</p>
              <p className="text-sm text-zinc-600">+34 XXX XXX XXX</p>
            </div>
          </div>
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
