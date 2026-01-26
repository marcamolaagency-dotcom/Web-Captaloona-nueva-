import { supabase, isSupabaseConfigured } from './supabase';
import type {
  Artist,
  ArtistInsert,
  Artwork,
  ArtworkInsert,
  Event,
  EventInsert,
  ContactMessageInsert,
} from './database.types';
import { INITIAL_ARTWORKS, INITIAL_EVENTS, ARTISTS } from '../constants';
import type { Artwork as LocalArtwork, EventItem, OtherEvent, Artist as LocalArtist } from '../types';

// ============================================
// ARTISTS
// ============================================

export async function getArtists(): Promise<LocalArtist[]> {
  if (!isSupabaseConfigured()) {
    return ARTISTS;
  }

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching artists:', error);
    return ARTISTS;
  }

  return data.map((artist) => ({
    id: artist.id,
    name: artist.name,
    bio: artist.bio,
    imageUrl: artist.image_url,
    location: artist.location || undefined,
  }));
}

export async function createArtist(artist: Omit<LocalArtist, 'id'>): Promise<LocalArtist | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const id = artist.name.toLowerCase().replace(/\s+/g, '-');

  const { data, error } = await supabase
    .from('artists')
    .insert({
      id,
      name: artist.name,
      bio: artist.bio,
      image_url: artist.imageUrl,
      location: artist.location,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating artist:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    bio: data.bio,
    imageUrl: data.image_url,
    location: data.location || undefined,
  };
}

export async function deleteArtist(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const { error } = await supabase
    .from('artists')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting artist:', error);
    return false;
  }

  return true;
}

// ============================================
// ARTWORKS
// ============================================

export async function getArtworks(): Promise<LocalArtwork[]> {
  if (!isSupabaseConfigured()) {
    return INITIAL_ARTWORKS;
  }

  const { data, error } = await supabase
    .from('artworks')
    .select(`
      *,
      artists (name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching artworks:', error);
    return INITIAL_ARTWORKS;
  }

  return data.map((artwork: any) => ({
    id: artwork.id,
    title: artwork.title,
    artistId: artwork.artist_id,
    artistName: artwork.artists?.name || '',
    medium: artwork.medium,
    size: artwork.size,
    price: artwork.price,
    imageUrl: artwork.image_url,
    category: artwork.category,
    status: artwork.status,
  }));
}

export async function createArtwork(artwork: Omit<LocalArtwork, 'id'>): Promise<LocalArtwork | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data, error } = await supabase
    .from('artworks')
    .insert({
      title: artwork.title,
      artist_id: artwork.artistId,
      medium: artwork.medium,
      size: artwork.size,
      price: artwork.price,
      image_url: artwork.imageUrl,
      category: artwork.category,
      status: artwork.status,
    })
    .select(`
      *,
      artists (name)
    `)
    .single();

  if (error) {
    console.error('Error creating artwork:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    artistId: data.artist_id,
    artistName: (data as any).artists?.name || '',
    medium: data.medium,
    size: data.size,
    price: data.price,
    imageUrl: data.image_url,
    category: data.category,
    status: data.status,
  };
}

export async function updateArtwork(id: string, updates: Partial<LocalArtwork>): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const { error } = await supabase
    .from('artworks')
    .update({
      title: updates.title,
      artist_id: updates.artistId,
      medium: updates.medium,
      size: updates.size,
      price: updates.price,
      image_url: updates.imageUrl,
      category: updates.category,
      status: updates.status,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating artwork:', error);
    return false;
  }

  return true;
}

export async function deleteArtwork(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const { error } = await supabase
    .from('artworks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting artwork:', error);
    return false;
  }

  return true;
}

// ============================================
// EVENTS (Exposiciones)
// ============================================

export async function getEvents(): Promise<EventItem[]> {
  if (!isSupabaseConfigured()) {
    return INITIAL_EVENTS;
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_type', 'exposicion')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error);
    return INITIAL_EVENTS;
  }

  return data.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    location: event.location,
    description: event.description,
    imageUrl: event.image_url,
  }));
}

export async function createEvent(event: Omit<EventItem, 'id'>): Promise<EventItem | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data, error } = await supabase
    .from('events')
    .insert({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      image_url: event.imageUrl,
      event_type: 'exposicion',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    date: data.date,
    location: data.location,
    description: data.description,
    imageUrl: data.image_url,
  };
}

export async function deleteEvent(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    return false;
  }

  return true;
}

// ============================================
// OTHER EVENTS (Talleres, Charlas, etc.)
// ============================================

export async function getOtherEvents(): Promise<OtherEvent[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_type', 'otro')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching other events:', error);
    return [];
  }

  return data.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    category: event.category || '',
    description: event.description,
    imageUrl: event.image_url,
  }));
}

export async function createOtherEvent(event: Omit<OtherEvent, 'id'>): Promise<OtherEvent | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data, error } = await supabase
    .from('events')
    .insert({
      title: event.title,
      date: event.date,
      location: '',
      description: event.description,
      image_url: event.imageUrl,
      event_type: 'otro',
      category: event.category,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating other event:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    date: data.date,
    category: data.category || '',
    description: data.description,
    imageUrl: data.image_url,
  };
}

export async function deleteOtherEvent(id: string): Promise<boolean> {
  return deleteEvent(id);
}

// ============================================
// CONTACT MESSAGES
// ============================================

export async function submitContactMessage(
  name: string,
  email: string,
  message: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.log('Contact form submission (offline mode):', { name, email, message });
    return true;
  }

  const { error } = await supabase
    .from('contact_messages')
    .insert({
      name,
      email,
      message,
    });

  if (error) {
    console.error('Error submitting contact message:', error);
    return false;
  }

  return true;
}

export async function getContactMessages() {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }

  return data;
}

// ============================================
// SETTINGS (Featured Artworks, etc.)
// ============================================

export async function getFeaturedArtworkIds(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem('featuredArtworkIds');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'featured_artwork_ids')
    .single();

  if (error) {
    // If no setting found, return empty array (not an error)
    if (error.code === 'PGRST116') {
      return [];
    }
    console.error('Error fetching featured artwork IDs:', error);
    return [];
  }

  return data?.value || [];
}

export async function saveFeaturedArtworkIds(ids: string[]): Promise<boolean> {
  // Always save to localStorage as backup
  localStorage.setItem('featuredArtworkIds', JSON.stringify(ids));

  if (!isSupabaseConfigured()) {
    return true;
  }

  const { error } = await supabase
    .from('settings')
    .upsert({
      key: 'featured_artwork_ids',
      value: ids,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'key'
    });

  if (error) {
    console.error('Error saving featured artwork IDs:', error);
    return false;
  }

  return true;
}
