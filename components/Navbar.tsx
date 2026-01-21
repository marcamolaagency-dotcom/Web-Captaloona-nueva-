
import React, { useState, useEffect } from 'react';
import { Language } from '../types.ts';
import { TRANSLATIONS } from '../translations.ts';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, lang, onLanguageChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const t = TRANSLATIONS[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.home, path: '/' },
    { label: t.artist, path: '/artista' },
    { label: t.collection, path: '/coleccion' },
    { label: t.events, path: '/eventos' },
    { label: t.otherEvents, path: '/otros-eventos' },
    { label: t.space, path: '/espacio' },
    { label: t.contact, path: '/contacto' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass py-4 shadow-sm border-b border-zinc-100' : 'bg-white/80 backdrop-blur-md py-6 border-b border-zinc-50'}`}>
      <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
        {/* Logo / Branding */}
        <div 
          className="cursor-pointer flex flex-col group"
          onClick={() => onNavigate('/')}
        >
          <span className="text-xl font-bold tracking-[0.2em] text-zinc-900 leading-none serif uppercase group-hover:text-emerald-600 transition-colors">LOONA</span>
          <span className="text-[9px] tracking-[0.3em] text-zinc-400 font-medium uppercase mt-1">CONTEMPORARY</span>
        </div>

        {/* Navigation Items aligned to Right */}
        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-all hover:text-emerald-600 relative py-1 ${
                  currentPath === item.path || (currentPath === '' && item.path === '/')
                  ? 'text-emerald-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-emerald-600' 
                  : 'text-zinc-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Configuration Link (Small Icon) */}
          <button 
            onClick={() => onNavigate('/config')}
            className={`p-2 transition-colors ${currentPath === '/config' ? 'text-emerald-600' : 'text-zinc-300 hover:text-zinc-600'}`}
            title="Administración"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center border-l border-zinc-100 pl-6 ml-2 space-x-3">
            {(['ES', 'IT', 'EN', 'FR'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => onLanguageChange(l)}
                className={`text-[8px] font-bold transition-all p-1 rounded ${lang === l ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
