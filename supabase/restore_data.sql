-- ============================================
-- RESTORE: Artistas y Obras originales
-- ============================================
-- Ejecuta esto en Supabase SQL Editor para
-- restaurar los datos que estaban originalmente.
-- Usa ON CONFLICT DO NOTHING para no duplicar.
-- ============================================

-- ARTISTAS
INSERT INTO artists (id, name, bio, image_url, location) VALUES
(
  'claudio-fiorentini',
  'Claudio Fiorentini',
  'Un buen trozo de mundo en su historia y una buena dosis de experiencias culturales, unidos a una irrefrenable curiosidad que nunca ha puesto límites a sus estudios hacen de Claudio Fiorentini un auténtico mediador cultural, un promotor de las artes capaz de unir diferentes puntos de vista, de dialogar con diferentes opiniones, de comprender los polifacéticos hábitos y costumbres que constituyen el motor de la cultura contemporánea.

Su obra literaria abarca narrativa y poesía. Diez novelas, una colección de cuentos, siete poemarios, uno de ellos es una colección de sonetos políticos publicado con pseudónimo, son sus actuales publicaciones, además de haber sido incluido en numerosas antologías.

Su obra pictórica, mejor sería decir para-pictórica, como él mismo ama definirla, es una continua búsqueda de formas de expresión abstracta, a través del uso de materiales pobres de diferente consistencia táctil. El tacto es, de hecho, la llave para comprender el sentido de su búsqueda de equilibrios, a partir de la manipulación del fondo, que solo cuando son apercibidos trascienden en pintura con el auxilio de los pinceles.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  'Madrid, España'
),
(
  'leonardo-eymil',
  'Leonardo Eymil',
  'Maestro del carboncillo y la figura humana. Sus obras capturan la esencia efímera del movimiento y la fragilidad de la existencia.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
  'Madrid, España'
)
ON CONFLICT (id) DO NOTHING;

-- OBRAS
INSERT INTO artworks (title, artist_id, medium, size, price, image_url, category, status, is_permanent) VALUES
(
  'Jazz Remastered',
  'claudio-fiorentini',
  'Técnica mixta sobre lienzo',
  '50x70 cm',
  1200,
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop',
  'Pintura',
  'disponible',
  false
),
(
  'Fragmentos de Caos',
  'claudio-fiorentini',
  'Acrílico y arena',
  '100x100 cm',
  2500,
  'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop',
  'Pintura',
  'vendido',
  false
);
