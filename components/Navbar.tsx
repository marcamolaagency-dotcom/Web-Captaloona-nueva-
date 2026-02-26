
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: t.home, path: '/' },
    { label: t.artists, path: '/artistas' },
    { label: t.events, path: '/eventos' },
    { label: t.otherEvents, path: '/otros-eventos' },
    { label: t.artist, path: '/artista' },
    { label: t.space, path: '/espacio' },
    { label: t.collection, path: '/coleccion' },
    { label: t.contact, path: '/contacto' },
  ];

  const handleNavigation = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass py-3 md:py-4 shadow-sm border-b border-zinc-100' : 'bg-white/80 backdrop-blur-md py-4 md:py-6 border-b border-zinc-50'}`}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo / Branding */}
          <div
            className="cursor-pointer flex flex-col group"
            onClick={() => handleNavigation('/')}
          >
            <span className="text-lg md:text-xl font-bold tracking-[0.2em] text-zinc-900 leading-none serif uppercase group-hover:text-emerald-600 transition-colors">LOONA</span>
            <span className="text-[8px] md:text-[9px] tracking-[0.3em] text-zinc-400 font-medium uppercase mt-1">CONTEMPORARY</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
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
              onClick={() => handleNavigation('/config')}
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span className={`block w-6 h-0.5 bg-zinc-900 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-zinc-900 my-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-zinc-900 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-40 lg:hidden transform transition-transform duration-300 ease-out shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-20 pb-8 px-6">
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full text-left py-4 px-4 text-base font-medium tracking-wide transition-colors rounded-lg ${
                      currentPath === item.path || (currentPath === '' && item.path === '/')
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              {/* Config link for mobile */}
              <li>
                <button
                  onClick={() => handleNavigation('/config')}
                  className={`w-full text-left py-4 px-4 text-base font-medium tracking-wide transition-colors rounded-lg flex items-center gap-3 ${
                    currentPath === '/config'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Administración
                </button>
              </li>
            </ul>
          </nav>

          {/* Language Switcher - Mobile */}
          <div className="border-t border-zinc-100 pt-6 mt-4">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-4 px-4">Idioma</p>
            <div className="flex items-center gap-2 px-4">
              {(['ES', 'IT', 'EN', 'FR'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    onLanguageChange(l);
                  }}
                  className={`flex-1 py-3 text-sm font-bold transition-all rounded-lg ${
                    lang === l
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
