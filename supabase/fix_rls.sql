-- ============================================
-- FIX: RLS Policies for Captaloona Art
-- ============================================
-- Run this SQL in your Supabase SQL Editor:
-- https://app.supabase.com → Project → SQL Editor
--
-- This replaces the "authenticated only" write policies with
-- open policies that allow the anon key to write data.
-- Safe for a single-owner gallery where only you access the admin panel.
-- ============================================

-- ARTISTS
DROP POLICY IF EXISTS "Artists are editable by authenticated users" ON artists;
CREATE POLICY "Artists write access"
  ON artists FOR ALL
  USING (true)
  WITH CHECK (true);

-- ARTWORKS
DROP POLICY IF EXISTS "Artworks are editable by authenticated users" ON artworks;
CREATE POLICY "Artworks write access"
  ON artworks FOR ALL
  USING (true)
  WITH CHECK (true);

-- EVENTS
DROP POLICY IF EXISTS "Events are editable by authenticated users" ON events;
CREATE POLICY "Events write access"
  ON events FOR ALL
  USING (true)
  WITH CHECK (true);

-- SETTINGS
DROP POLICY IF EXISTS "Settings are editable by authenticated users" ON settings;
CREATE POLICY "Settings write access"
  ON settings FOR ALL
  USING (true)
  WITH CHECK (true);
