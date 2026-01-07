
import React, { useState } from 'react';
// Fix: Imported INITIAL_ARTWORKS instead of ARTWORKS as it's the correct name in constants.tsx
import { INITIAL_ARTWORKS } from '../constants.tsx';

const Profiler: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { name: 'Caos', color: 'bg-red-500' },
    { name: 'Serenidad', color: 'bg-blue-300' },
    { name: 'Introspección', color: 'bg-indigo-900' },
    { name: 'Euforia', color: 'bg-yellow-400' },
  ];

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl serif mb-4">Inner Vision Profiler</h1>
        <div className="h-1 w-24 bg-emerald-600 mx-auto mb-8"></div>
        <p className="text-zinc-600">Responde visualmente para descubrir tu conexión con el arte de Captaloona.</p>
      </div>

      {step === 1 && (
        <div className="animate-fadeIn">
          <h2 className="text-2xl text-center mb-12">1. Selecciona el tono que define tu momento actual</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {moods.map((mood) => (
              <button
                key={mood.name}
                onClick={() => { setSelectedMood(mood.name); setStep(2); }}
                className="group relative h-48 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className={`${mood.color} absolute inset-0 transition-opacity opacity-70 group-hover:opacity-100`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-semibold uppercase tracking-widest">{mood.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fadeIn">
          <h2 className="text-2xl text-center mb-12">2. ¿Qué trazo te atrae más ahora mismo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button 
              onClick={() => setStep(3)}
              className="aspect-square border-2 border-transparent hover:border-emerald-600 transition-all overflow-hidden"
            >
              <img src="https://picsum.photos/id/115/600/600?grayscale" alt="Abstract 1" className="w-full h-full object-cover" />
            </button>
            <button 
              onClick={() => setStep(3)}
              className="aspect-square border-2 border-transparent hover:border-emerald-600 transition-all overflow-hidden"
            >
              <img src="https://picsum.photos/id/116/600/600?grayscale" alt="Abstract 2" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fadeIn text-center">
          <h2 className="text-3xl serif mb-6">Tu Visión Interior es: <span className="text-emerald-600 italic">"{selectedMood}"</span></h2>
          <p className="text-zinc-500 mb-12">Basado en tus respuestas, estas obras de Claudio Fiorentini podrían resonar contigo:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Fix: Using INITIAL_ARTWORKS correctly here */}
            {INITIAL_ARTWORKS.slice(0, 2).map((art) => (
              <div key={art.id} className="text-left bg-white p-6 shadow-xl rounded-sm">
                <img src={art.imageUrl} alt={art.title} className="w-full aspect-[4/3] object-cover mb-4" />
                <h3 className="text-xl serif">{art.title}</h3>
                <p className="text-sm text-zinc-500 mb-4">{art.medium}</p>
                <button className="text-emerald-600 text-sm font-bold uppercase tracking-widest hover:underline">Ver detalles</button>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setStep(1)}
            className="mt-16 text-zinc-400 hover:text-zinc-900 transition-colors uppercase text-xs tracking-[0.2em]"
          >
            Reiniciar Experiencia
          </button>
        </div>
      )}
    </div>
  );
};

export default Profiler;
