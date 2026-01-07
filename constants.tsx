
import { Artwork, EventItem, NavItem, Artist } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Profiler', path: '/profiler' },
  { label: 'Colección', path: '/coleccion' },
  { label: 'Claudio Fiorentini', path: '/artista' },
  { label: 'Eventos', path: '/eventos' },
  { label: 'Contacto', path: '/contacto' },
];

export const ARTISTS: Artist[] = [
  {
    id: 'claudio-fiorentini',
    name: 'Claudio Fiorentini',
    bio: 'Un auténtico mediador cultural, fundador de Captaloona Art. Su obra transita entre lo matérico y lo espiritual, buscando siempre la esencia del ser.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    location: 'Madrid, España'
  },
  {
    id: 'leonardo-eymil',
    name: 'Leonardo Eymil',
    bio: 'Maestro del carboncillo y la figura humana. Sus obras capturan la esencia efímera del movimiento y la fragilidad de la existencia.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
    location: 'Madrid, España'
  }
];

export const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: 'Jazz Remastered',
    artistId: 'claudio-fiorentini',
    artistName: 'Claudio Fiorentini',
    medium: 'Técnica mixta sobre lienzo',
    size: '50x70 cm',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop',
    category: 'Pintura',
    status: 'disponible'
  },
  {
    id: '2',
    title: 'Fragmentos de Caos',
    artistId: 'claudio-fiorentini',
    artistName: 'Claudio Fiorentini',
    medium: 'Acrílico y arena',
    size: '100x100 cm',
    price: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop',
    category: 'Pintura',
    status: 'vendido'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'e1',
    date: '24 NOV 2024',
    title: 'CONNECTIONS ONE',
    location: 'Sede Andrés Mellado, Madrid',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    description: 'Una exposición colectiva que explora los vínculos entre el arte matérico y la poesía visual.'
  }
];
