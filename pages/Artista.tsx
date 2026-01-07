
import React from 'react';

const Artista: React.FC = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-emerald-100 z-0"></div>
            <img 
              src="https://picsum.photos/id/64/800/1000?grayscale" 
              alt="Claudio Fiorentini" 
              className="relative z-10 w-full h-auto shadow-2xl"
            />
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <span className="text-emerald-600 text-sm font-bold uppercase tracking-[0.3em]">El Artista</span>
            <h1 className="text-6xl serif leading-tight">Claudio Fiorentini</h1>
            <div className="h-1 w-20 bg-emerald-600"></div>
            <p className="text-zinc-600 text-lg leading-relaxed italic">
              "Hay que ser fiel a los sueños, de no serlo ellos regresan y te presentan la cuenta."
            </p>
            <p className="text-zinc-500 leading-relaxed">
              Un buen trozo de mundo en su historia y una buena dosis de experiencias culturales, unidos a una irrefrenable curiosidad que nunca ha puesto límites a sus estudios hacen de Claudio Fiorentini un autentico mediador cultural...
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
              <div>
                <h4 className="font-bold text-zinc-900 mb-2 uppercase text-xs tracking-widest">Disciplinas</h4>
                <p className="text-sm text-zinc-500">Pintura, Poesía, Narrativa</p>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-2 uppercase text-xs tracking-widest">Fundador</h4>
                <p className="text-sm text-zinc-500">Captaloona Art Madrid</p>
              </div>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-4xl serif text-center mb-16 italic">Un legado multidisciplinar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-12 shadow-sm border border-zinc-100 text-center hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
              <h3 className="text-2xl serif mb-4">Poesía</h3>
              <p className="text-zinc-500 text-sm">Siete poemarios que exploran el lenguaje del alma y la resonancia del ser.</p>
            </div>
            <div className="bg-white p-12 shadow-sm border border-zinc-100 text-center hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
              <h3 className="text-2xl serif mb-4">Narrativa</h3>
              <p className="text-zinc-500 text-sm">Diez novelas y cuentos que construyen mundos paralelos de introspección.</p>
            </div>
            <div className="bg-white p-12 shadow-sm border border-zinc-100 text-center hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
              <h3 className="text-2xl serif mb-4">Pintura</h3>
              <p className="text-zinc-500 text-sm">Expresiones abstractas y matéricas que trascienden el plano visual.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Artista;
