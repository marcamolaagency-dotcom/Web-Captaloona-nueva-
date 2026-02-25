-- ============================================
-- CAPTALOONA ART DATABASE SCHEMA
-- ============================================
-- Run this SQL in your Supabase SQL Editor to create the database structure

-- ============================================
-- STORAGE BUCKET SETUP (Run in Storage section of Supabase Dashboard)
-- ============================================
-- 1. Go to Storage in your Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name it: captaloona-images
-- 4. Check "Public bucket" to allow public access
-- 5. Click "Create bucket"
--
-- Then run this SQL to set up storage policies:

-- Storage policies for the captaloona-images bucket
-- Allow public read access
INSERT INTO storage.buckets (id, name, public)
VALUES ('captaloona-images', 'captaloona-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'captaloona-images');

-- Allow authenticated users to update their files
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'captaloona-images');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'captaloona-images');

-- Allow public read access to all files
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'captaloona-images');

-- ============================================
-- DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE artwork_category AS ENUM ('Pintura', 'Escultura', 'Poesía', 'Narrativa');
CREATE TYPE artwork_status AS ENUM ('disponible', 'vendido');
CREATE TYPE event_type AS ENUM ('exposicion', 'otro');

-- ============================================
-- ARTISTS TABLE
-- ============================================

CREATE TABLE artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT NOT NULL,
    image_url TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_artists_name ON artists(name);

-- ============================================
-- ARTWORKS TABLE
-- ============================================

CREATE TABLE artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist_id TEXT NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    medium TEXT NOT NULL,
    size TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    image_url TEXT NOT NULL,
    category artwork_category NOT NULL DEFAULT 'Pintura',
    status artwork_status NOT NULL DEFAULT 'disponible',
    style TEXT,
    is_permanent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ALTER TABLE for existing installations:
-- ALTER TABLE artworks ADD COLUMN style TEXT;
-- ALTER TABLE artworks ADD COLUMN is_permanent BOOLEAN NOT NULL DEFAULT FALSE;

-- Create indexes
CREATE INDEX idx_artworks_artist ON artworks(artist_id);
CREATE INDEX idx_artworks_category ON artworks(category);
CREATE INDEX idx_artworks_status ON artworks(status);

-- ============================================
-- EVENTS TABLE
-- ============================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    event_type event_type NOT NULL DEFAULT 'exposicion',
    category TEXT,
    catalog_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ALTER TABLE for existing installations:
-- ALTER TABLE events ADD COLUMN catalog_url TEXT;
-- ALTER TABLE events ADD COLUMN video_url TEXT;

-- Create indexes
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_date ON events(date);

-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================

CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for unread messages
CREATE INDEX idx_messages_read ON contact_messages(read);

-- ============================================
-- SETTINGS TABLE (for featured artworks, etc.)
-- ============================================

CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Artists: Public read, authenticated write
CREATE POLICY "Artists are viewable by everyone" ON artists
    FOR SELECT USING (true);

CREATE POLICY "Artists are editable by authenticated users" ON artists
    FOR ALL USING (auth.role() = 'authenticated');

-- Artworks: Public read, authenticated write
CREATE POLICY "Artworks are viewable by everyone" ON artworks
    FOR SELECT USING (true);

CREATE POLICY "Artworks are editable by authenticated users" ON artworks
    FOR ALL USING (auth.role() = 'authenticated');

-- Events: Public read, authenticated write
CREATE POLICY "Events are viewable by everyone" ON events
    FOR SELECT USING (true);

CREATE POLICY "Events are editable by authenticated users" ON events
    FOR ALL USING (auth.role() = 'authenticated');

-- Contact messages: Anyone can insert, only authenticated can read
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can read messages" ON contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

-- Settings: Public read, authenticated write
CREATE POLICY "Settings are viewable by everyone" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Settings are editable by authenticated users" ON settings
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_artists_updated_at
    BEFORE UPDATE ON artists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artworks_updated_at
    BEFORE UPDATE ON artworks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA (Optional - run after tables are created)
-- ============================================

-- Insert initial artists
INSERT INTO artists (id, name, bio, image_url, location) VALUES
(
    'claudio-fiorentini',
    'Claudio Fiorentini',
    'Un auténtico mediador cultural, fundador de Captaloona Art. Su obra transita entre lo matérico y lo espiritual, buscando siempre la esencia del ser.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    'Madrid, España'
),
(
    'leonardo-eymil',
    'Leonardo Eymil',
    'Maestro del carboncillo y la figura humana. Sus obras capturan la esencia efímera del movimiento y la fragilidad de la existencia.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
    'Madrid, España'
);

-- Insert initial artworks
INSERT INTO artworks (title, artist_id, medium, size, price, image_url, category, status) VALUES
(
    'Jazz Remastered',
    'claudio-fiorentini',
    'Técnica mixta sobre lienzo',
    '50x70 cm',
    1200,
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop',
    'Pintura',
    'disponible'
),
(
    'Fragmentos de Caos',
    'claudio-fiorentini',
    'Acrílico y arena',
    '100x100 cm',
    2500,
    'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop',
    'Pintura',
    'vendido'
);

-- Insert initial events
INSERT INTO events (title, date, location, description, image_url, event_type) VALUES
(
    'CONNECTIONS ONE',
    '24 NOV 2024',
    'Sede Andrés Mellado, Madrid',
    'Una exposición colectiva que explora los vínculos entre el arte matérico y la poesía visual.',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    'exposicion'
);

-- Insert sample other events
INSERT INTO events (title, date, location, description, image_url, event_type, category) VALUES
(
    'Taller de Materia y Textura',
    '15 DIC 2024',
    '',
    'Explora el uso de materiales no convencionales en la pintura contemporánea de la mano de nuestros artistas residentes.',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800',
    'otro',
    'Taller'
),
(
    'Presentación: La Poesía del Caos',
    '20 DIC 2024',
    '',
    'Una tarde dedicada a la narrativa introspectiva y su relación con el arte visual moderno.',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800',
    'otro',
    'Literatura'
);
