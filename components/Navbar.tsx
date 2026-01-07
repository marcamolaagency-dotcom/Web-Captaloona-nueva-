
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants.tsx';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass border-b border-zinc-200 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div 
          className="cursor-pointer group flex flex-col"
          onClick={() => onNavigate('/')}
        >
          <span className="text-2xl font-semibold tracking-widest text-zinc-900 leading-none">CAPTALOONA ART</span>
          <span className="text-xs tracking-[0.4em] text-emerald-600 font-medium mt-1">MADRID</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`text-sm tracking-wide transition-colors ${
                currentPath === item.path 
                ? 'text-emerald-600 font-semibold' 
                : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <select className="bg-transparent text-xs border-none focus:ring-0 cursor-pointer text-zinc-500 hover:text-zinc-900">
            <option>ES</option>
            <option>EN</option>
            <option>FR</option>
            <option>IT</option>
          </select>
          <button className="md:hidden text-zinc-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
