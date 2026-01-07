
export interface Artist {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  location?: string;
}

export interface Artwork {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  medium: string;
  size: string;
  price: number;
  imageUrl: string;
  category: 'Poesía' | 'Narrativa' | 'Pintura' | 'Escultura';
  status: 'disponible' | 'vendido';
}

export interface NavItem {
  label: string;
  path: string;
}

export interface EventItem {
  id: string;
  date: string;
  title: string;
  location: string;
  imageUrl: string;
  description: string;
}
