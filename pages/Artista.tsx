
import React from 'react';
import { Language } from '../types.ts';

const Artista: React.FC<{ lang?: Language }> = ({ lang = 'ES' }) => {
  // Narrativa works
  const narrativaWorks = [
    { title: 'LIMBO 4.0', year: 2025 },
    { title: 'Torri di pietra', year: 2022 },
    { title: 'Concerto a Vanagloria', year: 2020 },
    { title: 'Fermata del bus', year: 2016 },
    { title: 'Piricotinali col ruspetto', year: 2015 },
    { title: 'Captaloona', year: 2013 },
    { title: 'Il misterioso caso di Via Delia da Gilal Gulta', year: 2010 },
    { title: 'La stella e la sua luce', year: 2008 },
    { title: 'Il faro di Biglise', year: 2007 },
    { title: 'Io parlo jazz', year: 2004 },
    { title: 'Ovvero, le porte del mare', year: 2002 },
  ];

  // Poesia works
  const poesiaWorks = [
    { title: 'Scarti non foste', year: 2024 },
    { title: 'I colori dell\'iride', year: 2019 },
    { title: 'Anonimo Monteverdino, riflessioni sulla storia recente', year: 2018 },
    { title: 'Sinfonia', year: 2017 },
    { title: 'Grido', year: 2015 },
    { title: 'Incauta magia del mentre', year: 2012 },
    { title: 'Da comunque uomo', year: 1992 },
  ];

  return (
    <div className="pt-40 pb-32 max-w-7xl mx-auto px-6 animate-fadeIn">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-32">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -top-10 -left-10 w-full h-full border border-emerald-100 z-0"></div>
          <img
            src="/images/claudio-fiorentini.jpg"
            alt="Claudio Fiorentini"
            className="relative z-10 w-full h-auto shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>
        <div className="order-1 lg:order-2 space-y-10">
          <div className="space-y-4">
            <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.5em]">
              El filósofo que enseña a los artistas a escuchar su abismo
            </span>
            <h1 className="text-7xl md:text-8xl serif italic leading-tight">Claudio Fiorentini</h1>
          </div>

          <div className="h-0.5 w-32 bg-emerald-600"></div>

          <p className="text-zinc-500 text-xl leading-relaxed font-light">
            Claudio Fiorentini no es un galerista tradicional. Es un <strong className="text-zinc-700">coach de artistas</strong> que les ayuda a encontrar y seguir su voz interior más auténtica, incluso cuando esa voz los lleva por caminos que el mercado del arte no comprende todavía.
          </p>

          <p className="text-zinc-500 text-lg leading-relaxed font-light">
            Antes de abrir Capataloona Art en Madrid, Claudio dedicó décadas a estudiar la relación entre el arte y el pensamiento humano. Escritor prolífico, ha desarrollado una visión única: <em className="text-emerald-700">el arte verdadero no decora, transforma conciencias</em>. No sigue tendencias — las anticipa. No busca aprobación — explora lo "no expresado" que bulle dentro de la humanidad.
          </p>
        </div>
      </div>

      {/* Methodology Section */}
      <section className="mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.4em]">Metodología</span>
            <h2 className="text-4xl serif italic">Más que curador: Facilitador de transformaciones</h2>
          </div>

          <p className="text-zinc-500 leading-relaxed">
            Lo que distingue a Claudio es su capacidad para identificar y nutrir el talento emergente auténtico. A través de <strong className="text-zinc-700">proyectos de investigación artística</strong> diseñados específicamente para cada creador, ayuda a los artistas a:
          </p>

          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <span className="w-1 h-1 bg-emerald-600 rounded-full mt-2.5 flex-shrink-0"></span>
              <span className="text-zinc-600"><strong className="text-zinc-800">Quebrar y reformular</strong> su lenguaje plástico (como describe la acuarelista Teresa Jimeno)</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-1 h-1 bg-emerald-600 rounded-full mt-2.5 flex-shrink-0"></span>
              <span className="text-zinc-600"><strong className="text-zinc-800">Profundizar en su subconsciente</strong> para encontrar la voz interior</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-1 h-1 bg-emerald-600 rounded-full mt-2.5 flex-shrink-0"></span>
              <span className="text-zinc-600"><strong className="text-zinc-800">Conectar con arquetipos universales</strong> que trascienden lo decorativo</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-1 h-1 bg-emerald-600 rounded-full mt-2.5 flex-shrink-0"></span>
              <span className="text-zinc-600"><strong className="text-zinc-800">Desarrollar coherencia conceptual</strong> entre su filosofía personal y su obra</span>
            </li>
          </ul>

          <p className="text-zinc-500 leading-relaxed italic">
            No les dice qué crear. Les ayuda a descubrir qué necesitan expresar.
          </p>
        </div>

        <div className="bg-zinc-50 p-10 space-y-8">
          <div className="space-y-4">
            <span className="text-amber-600 text-[10px] font-bold uppercase tracking-[0.4em]">Visión Crítica</span>
            <h3 className="text-2xl serif italic">Un crítico del "sistema enfermo"</h3>
          </div>

          <p className="text-zinc-600 leading-relaxed">
            Claudio se posiciona abiertamente contra el mercado tradicional del arte, al que llama "un sistema enfermo" donde:
          </p>

          <ul className="space-y-3 text-zinc-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-500">•</span>
              <span>Las galerías priorizan nombres establecidos sobre talento real</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500">•</span>
              <span>Los concursos temáticos canalizan la creatividad hacia lo predecible</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500">•</span>
              <span>La crítica alineada decide qué arte "merece" existir</span>
            </li>
          </ul>

          <p className="text-zinc-600 leading-relaxed">
            Frente a esto, ha creado <strong className="text-zinc-800">Capataloona Art</strong> como un espacio donde los artistas emergentes pueden desarrollarse sin comprometer su visión por agradar al sistema. Desde ahí se definió una selección de artistas presentados por Loona Contemporary.
          </p>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-zinc-950 text-white p-16 md:p-24 rounded-sm relative overflow-hidden mb-32">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/10 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
          <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.4em]">El impacto real en los artistas</span>
          <p className="text-zinc-300 text-lg leading-relaxed">
            Teresa Jimeno, acuarelista que ha trabajado con Claudio, describe su experiencia:
          </p>
          <blockquote className="text-2xl md:text-3xl serif italic leading-relaxed text-white/90">
            "Los proyectos de Capataloona Art supusieron una irrupción decisiva, quebrando y reformulando mi lenguaje plástico. TRANSITIONS me situó en una reflexión sobre el espacio y el tiempo; DOODELS abrió la puerta al subconsciente; ANGELS convirtió 'El Abrazo' en una auténtica revelación visual y emocional."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-12 bg-emerald-500"></div>
            <span className="text-zinc-400 text-sm uppercase tracking-widest">Teresa Jimeno, Acuarelista</span>
          </div>
          <p className="text-zinc-400 text-lg font-light pt-6 border-t border-zinc-800">
            Este es el método de Claudio: <strong className="text-white">no imponer, sino provocar</strong>. No dar respuestas, sino hacer las preguntas que obligan al artista a excavar más profundo en su propio ser.
          </p>
        </div>
      </section>

      {/* Works Section */}
      <section className="mb-32">
        <div className="text-center mb-16">
          <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.5em]">Obra Literaria</span>
          <h2 className="text-5xl serif italic mt-4">Disciplinas</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Narrativa */}
          <div className="space-y-8">
            <div className="border-b border-zinc-200 pb-4">
              <h3 className="text-2xl serif italic text-zinc-900">Narrativa</h3>
            </div>
            <ul className="space-y-4">
              {narrativaWorks.map((work, index) => (
                <li key={index} className="flex justify-between items-baseline group hover:bg-zinc-50 p-3 -mx-3 transition-colors">
                  <span className="text-zinc-700 group-hover:text-emerald-700 transition-colors">{work.title}</span>
                  <span className="text-zinc-400 text-sm font-light">({work.year})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Poesía */}
          <div className="space-y-8">
            <div className="border-b border-zinc-200 pb-4">
              <h3 className="text-2xl serif italic text-zinc-900">Poesía</h3>
            </div>
            <ul className="space-y-4">
              {poesiaWorks.map((work, index) => (
                <li key={index} className="flex justify-between items-baseline group hover:bg-zinc-50 p-3 -mx-3 transition-colors">
                  <span className="text-zinc-700 group-hover:text-emerald-700 transition-colors">{work.title}</span>
                  <span className="text-zinc-400 text-sm font-light">({work.year})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Philosophy Quote */}
      <section className="bg-emerald-50 p-16 md:p-24 rounded-sm text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl serif italic leading-tight text-zinc-900">
            "El arte verdadero no decora paredes, transforma conciencias."
          </h2>
          <div className="h-0.5 w-20 bg-emerald-600 mx-auto"></div>
          <p className="text-emerald-700 text-sm font-bold tracking-widest uppercase">Claudio Fiorentini</p>
        </div>
      </section>
    </div>
  );
};

export default Artista;
