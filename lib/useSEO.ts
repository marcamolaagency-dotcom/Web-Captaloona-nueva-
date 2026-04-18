
import { useEffect } from 'react';

const BASE_URL = 'https://loonacontemporary.com';

interface SEOMeta {
  title: string;
  description: string;
}

const SEO_MAP: Record<string, SEOMeta> = {
  '/': {
    title: 'Loona Contemporary | Arte Filosófico Madrid',
    description:
      'Plataforma curatorial dirigida por Claudio Fiorentini. Galería de arte contemporáneo emergente en Madrid con enfoque filosófico. Arte que anticipa el pensamiento.',
  },
  '/artista': {
    title: 'Claudio Fiorentini | Coach de Artistas y Curador — Madrid',
    description:
      'Filósofo, escritor y curador italiano radicado en Madrid. Creador del KHAOS Method y director de Captaloona Art. Más de 20 años acompañando artistas emergentes.',
  },
  '/coleccion': {
    title: 'Colección de Arte Contemporáneo | Captaloona Art Madrid',
    description:
      'Obras de arte emergente disponibles: pintura matérica, polimatérica y narrativa visual. Artistas emergentes internacionales en Madrid. Precios accesibles.',
  },
  '/eventos': {
    title: 'Exposiciones de Arte | Captaloona Art Gallery Madrid',
    description:
      'Exposiciones de arte contemporáneo en Captaloona Art, Andrés Mellado 55, Madrid. Próximas y pasadas exposiciones de artistas emergentes.',
  },
  '/artistas': {
    title: 'Artistas Emergentes | Loona Contemporary',
    description:
      'Artistas emergentes representados por Loona Contemporary: Victoria Márquez, Norbert Francis Attard y más. Descubre el arte del futuro.',
  },
  '/espacio': {
    title: 'Captaloona Art | Galería en Madrid Argüelles',
    description:
      'Galería de arte contemporáneo en Andrés Mellado 55, barrio Gaztambide, Madrid 28015. Horario: Lun-Vie 10-19h, Sáb 11-14h.',
  },
  '/galerias': {
    title: 'Nuestras Galerías | Loona Contemporary',
    description:
      'Espacios Loona Contemporary. Galerías propias y gestionadas dedicadas al arte contemporáneo emergente.',
  },
  '/historia': {
    title: 'Historia de Exposiciones | Loona Contemporary',
    description:
      'Archivo de exposiciones y eventos pasados de Captaloona Art y Loona Contemporary en Madrid.',
  },
  '/contacto': {
    title: 'Contacto | Loona Contemporary',
    description:
      'Contacta con Loona Contemporary para información sobre obras, exposiciones, coaching artístico y visitas a la galería Captaloona Art en Madrid.',
  },
};

const DEFAULT_SEO: SEOMeta = {
  title: 'Loona Contemporary | Arte Filosófico Madrid',
  description:
    'Plataforma curatorial de arte contemporáneo emergente en Madrid, dirigida por Claudio Fiorentini.',
};

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(path: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', `${BASE_URL}${path}`);
}

export function useSEO(currentPath: string) {
  useEffect(() => {
    const meta = SEO_MAP[currentPath] ?? DEFAULT_SEO;

    document.title = meta.title;

    setMeta('description', meta.description);
    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url', `${BASE_URL}${currentPath}`, 'property');
    setMeta('twitter:title', meta.title, 'property');
    setMeta('twitter:description', meta.description, 'property');
    setMeta('twitter:url', `${BASE_URL}${currentPath}`, 'property');

    setCanonical(currentPath);
  }, [currentPath]);
}
