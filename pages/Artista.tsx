
import React from 'react';
import { Language } from '../types.ts';
import { TRANSLATIONS } from '../translations.ts';

const Artista: React.FC<{ lang?: Language }> = ({ lang = 'ES' }) => {
  const t = TRANSLATIONS[lang].artist;

  // Narrativa works (same in all languages - Italian titles)
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

  // Poesia works (same in all languages - Italian titles)
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
              {t.roleSubtitle}
            </span>
            <h1 className="text-7xl md:text-8xl serif italic leading-tight">{t.title}</h1>
          </div>

          <div className="h-0.5 w-32 bg-emerald-600"></div>

          <p
            className="text-zinc-500 text-xl leading-relaxed font-light"
            dangerouslySetInnerHTML={{ __html: t.bio1 }}
          />

          <p
            className="text-zinc-500 text-lg leading-relaxed font-light"
            dangerouslySetInnerHTML={{ __html: t.bio2 }}
          />
        </div>
      </div>

      {/* Methodology Section */}
      <section className="mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.4em]">{t.methodology}</span>
            <h2 className="text-4xl serif italic">{t.methodologyTitle}</h2>
          </div>

          <p
            className="text-zinc-500 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.methodologyIntro }}
          />

          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <span className="w-1 h-1 bg-emerald-600 rounded-full mt-2.5 flex-shrink-0"></span>
              <span className="text-zinc-600" dangerouslySetInnerHTML={{ __html: t.methodologyItem1 }} />
            </li>
            <li className="flex items-start gap-4">
              <span className="w-1 h-1 bg-emerald-600 rounded-full mt-2.5 flex-shrink-0"></span>
              <span className="text-zinc-600" dangerouslySetInnerHTML={{ __html: t.methodologyItem2 }} />
            </li>
            <li className="flex items-start gap-4">
              <span className="w-1 h-1 bg-emerald-600 rounded-full mt-2.5 flex-shrink-0"></span>
              <span className="text-zinc-600" dangerouslySetInnerHTML={{ __html: t.methodologyItem3 }} />
            </li>
            <li className="flex items-start gap-4">
              <span className="w-1 h-1 bg-emerald-600 rounded-full mt-2.5 flex-shrink-0"></span>
              <span className="text-zinc-600" dangerouslySetInnerHTML={{ __html: t.methodologyItem4 }} />
            </li>
          </ul>

          <p className="text-zinc-500 leading-relaxed italic">
            {t.methodologyConclusion}
          </p>
        </div>

        <div className="bg-zinc-50 p-10 space-y-8">
          <div className="space-y-4">
            <span className="text-amber-600 text-[10px] font-bold uppercase tracking-[0.4em]">{t.criticalVision}</span>
            <h3 className="text-2xl serif italic">{t.criticalTitle}</h3>
          </div>

          <p className="text-zinc-600 leading-relaxed">
            {t.criticalIntro}
          </p>

          <ul className="space-y-3 text-zinc-600">
            <li className="flex items-start gap-3">
              <span className="text-amber-500">•</span>
              <span>{t.criticalItem1}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500">•</span>
              <span>{t.criticalItem2}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500">•</span>
              <span>{t.criticalItem3}</span>
            </li>
          </ul>

          <p
            className="text-zinc-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.criticalConclusion }}
          />
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-zinc-950 text-white p-16 md:p-24 rounded-sm relative overflow-hidden mb-32">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/10 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
          <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.4em]">{t.testimonialLabel}</span>
          <p className="text-zinc-300 text-lg leading-relaxed">
            {t.testimonialIntro}
          </p>
          <blockquote className="text-2xl md:text-3xl serif italic leading-relaxed text-white/90">
            {t.testimonialQuote}
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-12 bg-emerald-500"></div>
            <span className="text-zinc-400 text-sm uppercase tracking-widest">{t.testimonialAuthor}</span>
          </div>
          <p
            className="text-zinc-400 text-lg font-light pt-6 border-t border-zinc-800"
            dangerouslySetInnerHTML={{ __html: t.testimonialConclusion }}
          />
        </div>
      </section>

      {/* Works Section */}
      <section className="mb-32">
        <div className="text-center mb-16">
          <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.5em]">{t.literaryWork}</span>
          <h2 className="text-5xl serif italic mt-4">{t.disciplines}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Narrativa */}
          <div className="space-y-8">
            <div className="border-b border-zinc-200 pb-4">
              <h3 className="text-2xl serif italic text-zinc-900">{t.narrative}</h3>
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
              <h3 className="text-2xl serif italic text-zinc-900">{t.poetry}</h3>
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
            {t.philosophyQuote}
          </h2>
          <div className="h-0.5 w-20 bg-emerald-600 mx-auto"></div>
          <p className="text-emerald-700 text-sm font-bold tracking-widest uppercase">{t.title}</p>
        </div>
      </section>
    </div>
  );
};

export default Artista;
