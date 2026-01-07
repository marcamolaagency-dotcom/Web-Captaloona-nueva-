
import React from 'react';

const Home: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/id/111/1920/1080?grayscale" 
            alt="Art Gallery Backdrop" 
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fafafa]/50 via-transparent to-[#fafafa]"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="text-emerald-600 uppercase tracking-[0.3em] text-sm font-semibold mb-6 block">Descubre tu Visión Interior</span>
          <h1 className="text-6xl md:text-8xl font-normal text-zinc-900 mb-8 leading-tight">Capturando lo invisible a través del arte.</h1>
          <p className="text-lg md:text-xl text-zinc-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Captaloona Art es un espacio inclusivo caracterizado por un gran espíritu cosmopolita en el corazón de Madrid.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => onNavigate('/profiler')}
              className="px-10 py-4 bg-zinc-900 text-white tracking-[0.2em] uppercase text-sm hover:bg-emerald-600 transition-all duration-500 shadow-xl"
            >
              Explora el Art Profiler
            </button>
            <button 
              onClick={() => onNavigate('/coleccion')}
              className="px-10 py-4 border border-zinc-900 text-zinc-900 tracking-[0.2em] uppercase text-sm hover:bg-zinc-900 hover:text-white transition-all duration-500"
            >
              Ver Colección
            </button>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl serif mb-4">Obras Destacadas</h2>
            <p className="text-zinc-500 italic">Selección curada de Claudio Fiorentini</p>
          </div>
          <button 
             onClick={() => onNavigate('/coleccion')}
             className="text-sm font-semibold border-b border-zinc-900 pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all"
          >
            Ver catálogo completo
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden bg-zinc-100 mb-6">
                <img 
                  src={`https://picsum.photos/id/${100+i}/600/800`} 
                  alt="Featured Art" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl serif mb-1">Visión {i}</h3>
              <p className="text-sm text-zinc-500 uppercase tracking-widest">Pintura • 2024</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inner Vision Profiler Teaser */}
      <section className="bg-zinc-900 text-white py-32 relative overflow-hidden">
        <div className="inner-vision-gradient absolute inset-0 opacity-30"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl serif mb-8 italic">¿Qué dice tu visión interior?</h2>
          <p className="text-lg text-zinc-400 mb-12 leading-relaxed">
            Nuestro "Art Profiler" utiliza algoritmos visuales inspirados en la psicología del color y la forma para conectarte con las obras que resuenan con tu estado consciente e inconsciente.
          </p>
          <button 
            onClick={() => onNavigate('/profiler')}
            className="px-12 py-5 border-2 border-emerald-500 text-emerald-500 text-sm tracking-widest uppercase hover:bg-emerald-500 hover:text-white transition-all duration-500 font-bold"
          >
            Comenzar Experiencia Profiler
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
