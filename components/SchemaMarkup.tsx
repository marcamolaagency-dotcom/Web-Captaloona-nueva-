
import React, { useEffect } from 'react';
import { Artwork, Artist, Event } from '../types';

interface SchemaMarkupProps {
  currentPath: string;
  artworks?: Artwork[];
  artists?: Artist[];
  events?: Event[];
}

const BASE_URL = 'https://loonacontempory.netlify.app';

// Generate VisualArtwork schema for artworks
const generateArtworkSchema = (artwork: Artwork, artist?: Artist) => ({
  "@context": "https://schema.org",
  "@type": "VisualArtwork",
  "name": artwork.title,
  "image": artwork.imageUrl,
  "artMedium": artwork.medium,
  "artworkSurface": artwork.medium,
  "width": artwork.size?.split('x')[0]?.trim(),
  "height": artwork.size?.split('x')[1]?.trim(),
  "creator": {
    "@type": "Person",
    "name": artwork.artistName,
    ...(artist && {
      "url": `${BASE_URL}/#/coleccion`,
      "image": artist.imageUrl
    })
  },
  "offers": artwork.status === 'disponible' ? {
    "@type": "Offer",
    "price": artwork.price,
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Loona Contemporary"
    }
  } : {
    "@type": "Offer",
    "availability": "https://schema.org/SoldOut"
  }
});

// Generate Event schema for exhibitions
const generateEventSchema = (event: Event) => ({
  "@context": "https://schema.org",
  "@type": "ExhibitionEvent",
  "name": event.title,
  "description": event.description,
  "image": event.imageUrl,
  "startDate": event.date,
  "location": {
    "@type": "Place",
    "name": "Captaloona Art",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Andrés Mellado 55",
      "addressLocality": "Madrid",
      "addressRegion": "Madrid",
      "postalCode": "28015",
      "addressCountry": "ES"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Loona Contemporary",
    "url": BASE_URL
  },
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
});

// Generate ItemList schema for collection page
const generateCollectionSchema = (artworks: Artwork[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Colección Captaloona",
  "description": "Colección de arte contemporáneo de Loona Contemporary",
  "numberOfItems": artworks.length,
  "itemListElement": artworks.slice(0, 10).map((artwork, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "VisualArtwork",
      "name": artwork.title,
      "image": artwork.imageUrl,
      "creator": {
        "@type": "Person",
        "name": artwork.artistName
      }
    }
  }))
});

// Generate FAQPage schema
const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(({ question, answer }) => ({
    "@type": "Question",
    "name": question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": answer
    }
  }))
});

const FAQ_HOME = [
  {
    question: "¿Qué es Loona Contemporary?",
    answer: "Loona Contemporary es una plataforma curatorial de arte contemporáneo dirigida por Claudio Fiorentini en Madrid. Conecta la introspección filosófica con el coleccionismo, representando artistas emergentes cuya obra anticipa el lenguaje visual del futuro."
  },
  {
    question: "¿Cómo empezar a coleccionar arte contemporáneo en Madrid?",
    answer: "Para empezar a coleccionar arte contemporáneo en Madrid, Loona Contemporary recomienda visitar Captaloona Art en Andrés Mellado 55, Gaztambide, donde los asesores acompañan al coleccionista primerizo a descubrir obras emergentes accesibles y con potencial de revalorización. También puedes completar el Art Profiler para descubrir qué estilo artístico conecta con tu personalidad."
  },
  {
    question: "¿Qué es el Art Profiler de Loona Contemporary?",
    answer: "El Art Profiler es una herramienta de Loona Contemporary que, a través de preguntas sobre tu personalidad y sensibilidad, identifica qué tipo de arte contemporáneo conecta contigo. Es el punto de entrada ideal para coleccionistas que se inician en el arte."
  }
];

const FAQ_ARTISTA = [
  {
    question: "¿Qué es el KHAOS Method de Claudio Fiorentini?",
    answer: "El KHAOS Method es la metodología de trabajo artístico desarrollada por Claudio Fiorentini. No busca imponer una dirección creativa, sino provocar al artista para que excave en su propio subconsciente y encuentre su voz interior. A través de proyectos de investigación artística el artista es motivado a desarrollar su camino; al mismo tiempo se buscan los enlaces más profundos que convierten la experiencia en una unión profunda, siendo la de los artistas una comunidad aún no manifiesta. Además, el método ayuda a quebrar el lenguaje plástico establecido y reformularlo desde arquetipos universales."
  },
  {
    question: "¿Qué diferencia a Loona Contemporary de otras galerías de arte en Madrid?",
    answer: "Loona Contemporary no es una galería, sino un concepto que se despliega en una plataforma filosófica y curatorial. Trabaja en prevalencia con artistas emergentes, posicionándose en un nicho de mercado que aún no se ha explorado del todo. Si el mercado del arte tradicional prioriza nombres establecidos, Loona Contemporary se concentra sobre el talento. El espacio físico no es un perímetro de paredes en las que se cuelgan cuadros, sino una partitura en la que se desarrolla la «suite» musical del arte en su conjunto. El concepto Loona Contemporary, nacido en el espacio Captaloona Art Madrid, se reconoce en el lema «El arte no tiene fronteras»."
  },
  {
    question: "¿Cómo trabaja Claudio Fiorentini con los artistas?",
    answer: "Claudio trabaja como coach de artistas y curador. Define para cada artista proyectos de investigación individualizados que los ayudan a profundizar en su subconsciente, conectar con arquetipos universales y desarrollar coherencia conceptual entre su filosofía personal y su obra. Como describe Teresa Jimeno, acuarelista: «Los proyectos de Capataloona Art supusieron una irrupción decisiva, quebrando y reformulando mi lenguaje plástico.»"
  },
  {
    question: "¿Quién es Claudio Fiorentini?",
    answer: "Claudio Fiorentini es escritor, poeta, pintor, crítico literario, curador y coach de artistas. Nacido en Roma, Italia, residente en Madrid desde el año 2018. Autor de diez novelas, una colección de relatos breves y siete poemarios, es director de Loona Contemporary y animador de Captaloona Art. Es un reconocido mediador cultural que conecta distintas tradiciones artísticas con el coleccionismo contemporáneo."
  }
];

const FAQ_ESPACIO = [
  {
    question: "¿Dónde está Captaloona Art?",
    answer: "Captaloona Art está en Andrés Mellado 55, barrio Gaztambide, Madrid 28015. Se encuentra en el distrito de Argüelles, a pocos minutos del metro Islas Filipinas y Argüelles."
  },
  {
    question: "¿Cuándo está abierta la galería Captaloona Art?",
    answer: "Captaloona Art abre de lunes a viernes de 10:00 a 19:00, y los sábados de 11:00 a 14:00. Para visitas concertadas fuera de horario, puede contactar en info@loonacontemporary.com o por teléfono al +34 669 61 62 20."
  },
  {
    question: "¿Qué tipo de arte expone Captaloona Art?",
    answer: "Captaloona Art expone arte contemporáneo emergente con enfoque filosófico: pintura matérica y polimatérica, neo-expresionismo mediterráneo, obra sobre papel y escultura. Todos los artistas son seleccionados por Claudio Fiorentini siguiendo el criterio de que el arte debe anticipar el pensamiento, no seguirlo."
  }
];

// Generate BreadcrumbList schema
const generateBreadcrumbSchema = (currentPath: string) => {
  const pathMap: Record<string, { name: string; position: number }[]> = {
    '/': [{ name: 'Inicio', position: 1 }],
    '/coleccion': [
      { name: 'Inicio', position: 1 },
      { name: 'Colección', position: 2 }
    ],
    '/artista': [
      { name: 'Inicio', position: 1 },
      { name: 'Claudio Fiorentini', position: 2 }
    ],
    '/eventos': [
      { name: 'Inicio', position: 1 },
      { name: 'Exposiciones', position: 2 }
    ],
    '/otros-eventos': [
      { name: 'Inicio', position: 1 },
      { name: 'Otros Eventos', position: 2 }
    ],
    '/espacio': [
      { name: 'Inicio', position: 1 },
      { name: 'Captaloona Art', position: 2 }
    ],
    '/contacto': [
      { name: 'Inicio', position: 1 },
      { name: 'Contacto', position: 2 }
    ]
  };

  const items = pathMap[currentPath] || pathMap['/'];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map(item => ({
      "@type": "ListItem",
      "position": item.position,
      "name": item.name,
      "item": item.position === 1 ? BASE_URL : `${BASE_URL}/${currentPath}`
    }))
  };
};

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({
  currentPath,
  artworks = [],
  artists = [],
  events = []
}) => {
  useEffect(() => {
    // Remove any existing dynamic schemas
    const existingSchemas = document.querySelectorAll('script[data-dynamic-schema]');
    existingSchemas.forEach(el => el.remove());

    const schemas: object[] = [];

    // Always add breadcrumb
    schemas.push(generateBreadcrumbSchema(currentPath));

    // Add page-specific schemas
    switch (currentPath) {
      case '/':
        schemas.push(generateFAQSchema(FAQ_HOME));
        break;

      case '/artista':
        schemas.push(generateFAQSchema(FAQ_ARTISTA));
        break;

      case '/espacio':
        schemas.push(generateFAQSchema(FAQ_ESPACIO));
        break;

      case '/coleccion':
        if (artworks.length > 0) {
          schemas.push(generateCollectionSchema(artworks));
          // Add individual artwork schemas (limit to first 5 for performance)
          artworks.slice(0, 5).forEach(artwork => {
            const artist = artists.find(a => a.id === artwork.artistId);
            schemas.push(generateArtworkSchema(artwork, artist));
          });
        }
        break;

      case '/eventos':
        events.forEach(event => {
          schemas.push(generateEventSchema(event));
        });
        break;

      default:
        break;
    }

    // Inject schemas into head
    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic-schema', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup on unmount
    return () => {
      const dynamicSchemas = document.querySelectorAll('script[data-dynamic-schema]');
      dynamicSchemas.forEach(el => el.remove());
    };
  }, [currentPath, artworks, artists, events]);

  return null; // This component doesn't render anything visible
};

export default SchemaMarkup;
