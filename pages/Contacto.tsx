
import React from 'react';

const Contacto: React.FC = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl serif mb-6 italic">Hablemos de Arte</h1>
          <p className="text-zinc-500 max-w-xl mx-auto">¿Tienes preguntas sobre alguna obra o estás interesado en realizar una exposición? Estamos aquí para escucharte.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="bg-white p-10 shadow-2xl rounded-sm border border-zinc-50">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Nombre</label>
                  <input type="text" className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-emerald-600 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email</label>
                  <input type="email" className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-emerald-600 transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Mensaje</label>
                <textarea rows={6} className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-emerald-600 transition-colors resize-none"></textarea>
              </div>
              <button className="w-full bg-zinc-900 text-white py-4 uppercase tracking-[0.3em] text-sm hover:bg-emerald-600 transition-all duration-500 mt-4">
                Enviar mensaje
              </button>
            </form>
          </div>

          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-4 text-emerald-600">Teléfono</h4>
                <p className="text-zinc-900 font-medium">+34 669 61 62 20</p>
              </div>
              <div>
                <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-4 text-emerald-600">Email</h4>
                <p className="text-zinc-900 font-medium">captaloona@gmail.com</p>
              </div>
              <div className="sm:col-span-2">
                <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-4 text-emerald-600">Dirección</h4>
                <p className="text-zinc-900 font-medium leading-relaxed">
                  Calle de Andrés Mellado, 55<br />
                  28015 Madrid, España
                </p>
              </div>
            </div>

            <div className="h-80 bg-zinc-100 relative rounded-sm overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-700">
               {/* Simplified map representation */}
               <div className="absolute inset-0 flex items-center justify-center text-zinc-400 bg-zinc-100">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-2 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                    <p className="text-xs tracking-widest uppercase">Ubicación: Gaztambide, Madrid</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
