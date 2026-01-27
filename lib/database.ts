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
// LOCAL STORAGE HELPERS
// ============================================

const STORAGE_KEYS = {
  artists: 'captaloona_artists',
  artworks: 'captaloona_artworks',
  events: 'captaloona_events',
  otherEvents: 'captaloona_other_events',
  featuredArtworkIds: 'featuredArtworkIds',
};

function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

// ============================================
// ARTISTS
// ============================================

export async function getArtists(): Promise<LocalArtist[]> {
  if (!isSupabaseConfigured()) {
    // Use localStorage when Supabase is not configured
    const stored = getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, []);
    return stored.length > 0 ? stored : ARTISTS;
  }

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching artists:', error);
    return getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, ARTISTS);
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
  const id = artist.name.toLowerCase().replace(/\s+/g, '-');
  const newArtist: LocalArtist = {
    id,
    name: artist.name,
    bio: artist.bio,
    imageUrl: artist.imageUrl,
    location: artist.location,
  };

  if (!isSupabaseConfigured()) {
    // Save to localStorage
    const currentArtists = getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, ARTISTS);
    saveToLocalStorage(STORAGE_KEYS.artists, [...currentArtists, newArtist]);
    return newArtist;
  }

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
    // Fallback to localStorage on error
    const currentArtists = getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, ARTISTS);
    saveToLocalStorage(STORAGE_KEYS.artists, [...currentArtists, newArtist]);
    return newArtist;
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
    // Delete from localStorage
    const currentArtists = getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, ARTISTS);
    saveToLocalStorage(STORAGE_KEYS.artists, currentArtists.filter(a => a.id !== id));
    return true;
  }

  const { error } = await supabase
    .from('artists')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting artist:', error);
    // Still delete from localStorage as fallback
    const currentArtists = getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, ARTISTS);
    saveToLocalStorage(STORAGE_KEYS.artists, currentArtists.filter(a => a.id !== id));
    return false;
  }

  return true;
}

export async function updateArtist(id: string, updates: Partial<LocalArtist>): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    // Update in localStorage
    const currentArtists = getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, ARTISTS);
    const updatedArtists = currentArtists.map(a =>
      a.id === id ? { ...a, ...updates } : a
    );
    saveToLocalStorage(STORAGE_KEYS.artists, updatedArtists);
    return true;
  }

  const { error } = await supabase
    .from('artists')
    .update({
      name: updates.name,
      bio: updates.bio,
      image_url: updates.imageUrl,
      location: updates.location,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating artist:', error);
    // Fallback to localStorage
    const currentArtists = getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, ARTISTS);
    const updatedArtists = currentArtists.map(a =>
      a.id === id ? { ...a, ...updates } : a
    );
    saveToLocalStorage(STORAGE_KEYS.artists, updatedArtists);
    return false;
  }

  return true;
}

// ============================================
// ARTWORKS
// ============================================

export async function getArtworks(): Promise<LocalArtwork[]> {
  if (!isSupabaseConfigured()) {
    // Use localStorage when Supabase is not configured
    const stored = getFromLocalStorage<LocalArtwork[]>(STORAGE_KEYS.artworks, []);
    return stored.length > 0 ? stored : INITIAL_ARTWORKS;
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
    return getFromLocalStorage<LocalArtwork[]>(STORAGE_KEYS.artworks, INITIAL_ARTWORKS);
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
  const newArtwork: LocalArtwork = {
    ...artwork,
    id: Date.now().toString(),
  };

  if (!isSupabaseConfigured()) {
    // Save to localStorage
    const currentArtworks = getFromLocalStorage<LocalArtwork[]>(STORAGE_KEYS.artworks, INITIAL_ARTWORKS);
    saveToLocalStorage(STORAGE_KEYS.artworks, [newArtwork, ...currentArtworks]);
    return newArtwork;
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
    // Fallback to localStorage on error
    const currentArtworks = getFromLocalStorage<LocalArtwork[]>(STORAGE_KEYS.artworks, INITIAL_ARTWORKS);
    saveToLocalStorage(STORAGE_KEYS.artworks, [newArtwork, ...currentArtworks]);
    return newArtwork;
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
    // Delete from localStorage
    const currentArtworks = getFromLocalStorage<LocalArtwork[]>(STORAGE_KEYS.artworks, INITIAL_ARTWORKS);
    saveToLocalStorage(STORAGE_KEYS.artworks, currentArtworks.filter(a => a.id !== id));
    return true;
  }

  const { error } = await supabase
    .from('artworks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting artwork:', error);
    // Still delete from localStorage as fallback
    const currentArtworks = getFromLocalStorage<LocalArtwork[]>(STORAGE_KEYS.artworks, INITIAL_ARTWORKS);
    saveToLocalStorage(STORAGE_KEYS.artworks, currentArtworks.filter(a => a.id !== id));
    return false;
  }

  return true;
}

// ============================================
// EVENTS (Exposiciones)
// ============================================

export async function getEvents(): Promise<EventItem[]> {
  if (!isSupabaseConfigured()) {
    // Use localStorage when Supabase is not configured
    const stored = getFromLocalStorage<EventItem[]>(STORAGE_KEYS.events, []);
    return stored.length > 0 ? stored : INITIAL_EVENTS;
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_type', 'exposicion')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error);
    return getFromLocalStorage<EventItem[]>(STORAGE_KEYS.events, INITIAL_EVENTS);
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
  const newEvent: EventItem = {
    ...event,
    id: Date.now().toString(),
  };

  if (!isSupabaseConfigured()) {
    // Save to localStorage
    const currentEvents = getFromLocalStorage<EventItem[]>(STORAGE_KEYS.events, INITIAL_EVENTS);
    saveToLocalStorage(STORAGE_KEYS.events, [newEvent, ...currentEvents]);
    return newEvent;
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
    // Fallback to localStorage on error
    const currentEvents = getFromLocalStorage<EventItem[]>(STORAGE_KEYS.events, INITIAL_EVENTS);
    saveToLocalStorage(STORAGE_KEYS.events, [newEvent, ...currentEvents]);
    return newEvent;
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
    // Delete from localStorage
    const currentEvents = getFromLocalStorage<EventItem[]>(STORAGE_KEYS.events, INITIAL_EVENTS);
    saveToLocalStorage(STORAGE_KEYS.events, currentEvents.filter(e => e.id !== id));
    // Also delete from other events
    const currentOtherEvents = getFromLocalStorage<OtherEvent[]>(STORAGE_KEYS.otherEvents, []);
    saveToLocalStorage(STORAGE_KEYS.otherEvents, currentOtherEvents.filter(e => e.id !== id));
    return true;
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    // Still delete from localStorage as fallback
    const currentEvents = getFromLocalStorage<EventItem[]>(STORAGE_KEYS.events, INITIAL_EVENTS);
    saveToLocalStorage(STORAGE_KEYS.events, currentEvents.filter(e => e.id !== id));
    return false;
  }

  return true;
}

// ============================================
// OTHER EVENTS (Talleres, Charlas, etc.)
// ============================================

const INITIAL_OTHER_EVENTS_DB: OtherEvent[] = [
  {
    id: 'o1',
    date: '15 DIC 2024',
    title: 'Taller de Materia y Textura',
    category: 'Taller',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800',
    description: 'Explora el uso de materiales no convencionales en la pintura contemporánea de la mano de nuestros artistas residentes.'
  },
  {
    id: 'o2',
    date: '20 DIC 2024',
    title: 'Presentación: La Poesía del Caos',
    category: 'Literatura',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800',
    description: 'Una tarde dedicada a la narrativa introspectiva y su relación con el arte visual moderno.'
  }
];

export async function getOtherEvents(): Promise<OtherEvent[]> {
  if (!isSupabaseConfigured()) {
    // Use localStorage when Supabase is not configured
    const stored = getFromLocalStorage<OtherEvent[]>(STORAGE_KEYS.otherEvents, []);
    return stored.length > 0 ? stored : INITIAL_OTHER_EVENTS_DB;
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_type', 'otro')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching other events:', error);
    return getFromLocalStorage<OtherEvent[]>(STORAGE_KEYS.otherEvents, INITIAL_OTHER_EVENTS_DB);
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
  const newEvent: OtherEvent = {
    ...event,
    id: Date.now().toString(),
  };

  if (!isSupabaseConfigured()) {
    // Save to localStorage
    const currentEvents = getFromLocalStorage<OtherEvent[]>(STORAGE_KEYS.otherEvents, INITIAL_OTHER_EVENTS_DB);
    saveToLocalStorage(STORAGE_KEYS.otherEvents, [newEvent, ...currentEvents]);
    return newEvent;
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
    // Fallback to localStorage on error
    const currentEvents = getFromLocalStorage<OtherEvent[]>(STORAGE_KEYS.otherEvents, INITIAL_OTHER_EVENTS_DB);
    saveToLocalStorage(STORAGE_KEYS.otherEvents, [newEvent, ...currentEvents]);
    return newEvent;
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
  if (!isSupabaseConfigured()) {
    // Delete from localStorage
    const currentEvents = getFromLocalStorage<OtherEvent[]>(STORAGE_KEYS.otherEvents, INITIAL_OTHER_EVENTS_DB);
    saveToLocalStorage(STORAGE_KEYS.otherEvents, currentEvents.filter(e => e.id !== id));
    return true;
  }
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
