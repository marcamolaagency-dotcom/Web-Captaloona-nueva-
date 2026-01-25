
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

// Generate BreadcrumbList schema
const generateBreadcrumbSchema = (currentPath: string) => {
  const pathMap: Record<string, { name: string; position: number }[]> = {
    '#/': [{ name: 'Inicio', position: 1 }],
    '#/coleccion': [
      { name: 'Inicio', position: 1 },
      { name: 'Colección', position: 2 }
    ],
    '#/artista': [
      { name: 'Inicio', position: 1 },
      { name: 'Claudio Fiorentini', position: 2 }
    ],
    '#/eventos': [
      { name: 'Inicio', position: 1 },
      { name: 'Exposiciones', position: 2 }
    ],
    '#/otros-eventos': [
      { name: 'Inicio', position: 1 },
      { name: 'Otros Eventos', position: 2 }
    ],
    '#/espacio': [
      { name: 'Inicio', position: 1 },
      { name: 'Captaloona Art', position: 2 }
    ],
    '#/contacto': [
      { name: 'Inicio', position: 1 },
      { name: 'Contacto', position: 2 }
    ]
  };

  const items = pathMap[currentPath] || pathMap['#/'];

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
      case '#/coleccion':
        if (artworks.length > 0) {
          schemas.push(generateCollectionSchema(artworks));
          // Add individual artwork schemas (limit to first 5 for performance)
          artworks.slice(0, 5).forEach(artwork => {
            const artist = artists.find(a => a.id === artwork.artistId);
            schemas.push(generateArtworkSchema(artwork, artist));
          });
        }
        break;

      case '#/eventos':
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
