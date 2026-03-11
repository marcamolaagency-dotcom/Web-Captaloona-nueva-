
// Define and export the Language type used throughout the application
export type Language = 'ES' | 'IT' | 'EN' | 'FR';

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
  isPermanent?: boolean;
  style?: string;
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
  catalogUrl?: string;
  videoUrl?: string;
}

export interface OtherEvent {
  id: string;
  date: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

/**
 * Devuelve el texto en el idioma solicitado.
 * Compatible con texto plano (registros existentes) y con JSON multilingüe
 * generado por el admin: {"ES":"...","EN":"...","FR":"...","IT":"..."}.
 */
export function getLocalizedText(
  field: string | undefined | null,
  lang: Language,
  fallback: Language = 'ES'
): string {
  if (!field) return '';
  try {
    const parsed = JSON.parse(field);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return (parsed[lang] as string)
        || (parsed[fallback] as string)
        || (Object.values(parsed)[0] as string)
        || '';
    }
  } catch {}
  return field; // texto plano existente — sin cambios
}
