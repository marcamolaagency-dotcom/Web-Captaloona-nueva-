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
  const storedArtists = getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, []);

  if (!isSupabaseConfigured()) {
    return storedArtists;
  }

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching artists:', error);
    // Only use localStorage as fallback when Supabase is unreachable
    return storedArtists;
  }

  // Supabase is the source of truth — save its result and return it
  const artists = data.map((artist) => ({
    id: artist.id,
    name: artist.name,
    bio: artist.bio,
    imageUrl: artist.image_url,
    location: artist.location || undefined,
  }));

  saveToLocalStorage(STORAGE_KEYS.artists, artists);
  return artists;
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

  // ALWAYS save to localStorage first as backup
  const currentArtists = getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, []);
  const updatedArtists = [...currentArtists.filter(a => a.id !== id), newArtist];
  saveToLocalStorage(STORAGE_KEYS.artists, updatedArtists);

  if (!isSupabaseConfigured()) {
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
    return newArtist; // Already saved to localStorage
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
    const currentArtists = getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, []);
    saveToLocalStorage(STORAGE_KEYS.artists, currentArtists.filter(a => a.id !== id));
    return true;
  }

  const { error } = await supabase
    .from('artists')
    .delete()
    .eq('id', id);

  // Always sync localStorage with the deletion result
  const currentArtists = getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, []);
  saveToLocalStorage(STORAGE_KEYS.artists, currentArtists.filter(a => a.id !== id));

  if (error) {
    console.error('Error deleting artist:', error);
    return false;
  }

  return true;
}

export async function updateArtist(id: string, updates: Partial<LocalArtist>): Promise<boolean> {
  // ALWAYS update localStorage first as backup
  const currentArtists = getFromLocalStorage<LocalArtist[]>(STORAGE_KEYS.artists, []);
  const updatedArtists = currentArtists.map(a =>
    a.id === id ? { ...a, ...updates } : a
  );
  saveToLocalStorage(STORAGE_KEYS.artists, updatedArtists);

  if (!isSupabaseConfigured()) {
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
    return false; // Already saved to localStorage
  }

  return true;
}

// ============================================
// ARTWORKS
// ============================================

export async function getArtworks(): Promise<LocalArtwork[]> {
  const storedArtworks = getFromLocalStorage<LocalArtwork[]>(STORAGE_KEYS.artworks, []);

  if (!isSupabaseConfigured()) {
    return storedArtworks;
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
    // Only use localStorage as fallback when Supabase is unreachable
    return storedArtworks;
  }

  // Supabase is the source of truth — save its result and return it
  const artworks = data.map((artwork: any) => ({
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
    isPermanent: artwork.is_permanent ?? false,
    style: artwork.style || undefined,
  }));

  saveToLocalStorage(STORAGE_KEYS.artworks, artworks);
  return artworks;
}

export async function createArtwork(artwork: Omit<LocalArtwork, 'id'>): Promise<LocalArtwork | null> {
  const newArtwork: LocalArtwork = {
    ...artwork,
    id: Date.now().toString(),
  };

  // ALWAYS save to localStorage first as backup
  const currentArtworks = getFromLocalStorage<LocalArtwork[]>(STORAGE_KEYS.artworks, []);
  saveToLocalStorage(STORAGE_KEYS.artworks, [newArtwork, ...currentArtworks]);

  if (!isSupabaseConfigured()) {
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
      is_permanent: artwork.isPermanent ?? false,
      style: artwork.style || null,
    })
    .select(`
      *,
      artists (name)
    `)
    .single();

  if (error) {
    console.error('Error creating artwork:', error);
    return newArtwork; // Already saved to localStorage
  }

  const savedArtwork = {
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
    isPermanent: (data as any).is_permanent ?? false,
    style: (data as any).style || undefined,
  };

  // Update localStorage with the Supabase ID
  const updatedArtworks = currentArtworks.filter(a => a.id !== newArtwork.id);
  saveToLocalStorage(STORAGE_KEYS.artworks, [savedArtwork, ...updatedArtworks]);

  return savedArtwork;
}

export async function updateArtwork(id: string, updates: Partial<LocalArtwork>): Promise<boolean> {
  // Always update localStorage first
  const currentArtworks = getFromLocalStorage<LocalArtwork[]>(STORAGE_KEYS.artworks, []);
  const updatedArtworks = currentArtworks.map(a =>
    a.id === id ? { ...a, ...updates } : a
  );
  saveToLocalStorage(STORAGE_KEYS.artworks, updatedArtworks);

  if (!isSupabaseConfigured()) {
    return true;
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
      is_permanent: updates.isPermanent,
      style: updates.style || null,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating artwork:', error);
    return false;
  }

  return true;
}

export async function updateEvent(id: string, updates: Partial<EventItem>): Promise<boolean> {
  // Always update localStorage first
  const currentEvents = getFromLocalStorage<EventItem[]>(STORAGE_KEYS.events, []);
  const updatedEvents = currentEvents.map(e =>
    e.id === id ? { ...e, ...updates } : e
  );
  saveToLocalStorage(STORAGE_KEYS.events, updatedEvents);

  if (!isSupabaseConfigured()) {
    return true;
  }

  const { error } = await supabase
    .from('events')
    .update({
      title: updates.title,
      date: updates.date,
      location: updates.location,
      description: updates.description,
      image_url: updates.imageUrl,
      catalog_url: updates.catalogUrl || null,
      video_url: updates.videoUrl || null,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating event:', error);
    return false;
  }

  return true;
}

export async function deleteArtwork(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const currentArtworks = getFromLocalStorage<LocalArtwork[]>(STORAGE_KEYS.artworks, []);
    saveToLocalStorage(STORAGE_KEYS.artworks, currentArtworks.filter(a => a.id !== id));
    return true;
  }

  const { error } = await supabase
    .from('artworks')
    .delete()
    .eq('id', id);

  // Always sync localStorage with the deletion result
  const currentArtworks = getFromLocalStorage<LocalArtwork[]>(STORAGE_KEYS.artworks, []);
  saveToLocalStorage(STORAGE_KEYS.artworks, currentArtworks.filter(a => a.id !== id));

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
  const storedEvents = getFromLocalStorage<EventItem[]>(STORAGE_KEYS.events, []);

  if (!isSupabaseConfigured()) {
    return storedEvents;
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_type', 'exposicion')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error);
    // Only use localStorage as fallback when Supabase is unreachable
    return storedEvents;
  }

  // Supabase is the source of truth — save its result and return it
  const events = data.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    location: event.location,
    description: event.description,
    imageUrl: event.image_url,
    catalogUrl: (event as any).catalog_url || undefined,
    videoUrl: (event as any).video_url || undefined,
  }));

  saveToLocalStorage(STORAGE_KEYS.events, events);
  return events;
}

export async function createEvent(event: Omit<EventItem, 'id'>): Promise<EventItem | null> {
  const newEvent: EventItem = {
    ...event,
    id: Date.now().toString(),
  };

  // ALWAYS save to localStorage first as backup
  const currentEvents = getFromLocalStorage<EventItem[]>(STORAGE_KEYS.events, []);
  saveToLocalStorage(STORAGE_KEYS.events, [newEvent, ...currentEvents]);

  if (!isSupabaseConfigured()) {
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
      catalog_url: event.catalogUrl || null,
      video_url: event.videoUrl || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    return newEvent; // Already saved to localStorage
  }

  return {
    id: data.id,
    title: data.title,
    date: data.date,
    location: data.location,
    description: data.description,
    imageUrl: data.image_url,
    catalogUrl: (data as any).catalog_url || undefined,
    videoUrl: (data as any).video_url || undefined,
  };
}

export async function deleteEvent(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const currentEvents = getFromLocalStorage<EventItem[]>(STORAGE_KEYS.events, []);
    saveToLocalStorage(STORAGE_KEYS.events, currentEvents.filter(e => e.id !== id));
    const currentOtherEvents = getFromLocalStorage<OtherEvent[]>(STORAGE_KEYS.otherEvents, []);
    saveToLocalStorage(STORAGE_KEYS.otherEvents, currentOtherEvents.filter(e => e.id !== id));
    return true;
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  // Always sync localStorage with the deletion result
  const currentEvents = getFromLocalStorage<EventItem[]>(STORAGE_KEYS.events, []);
  saveToLocalStorage(STORAGE_KEYS.events, currentEvents.filter(e => e.id !== id));
  const currentOtherEvents = getFromLocalStorage<OtherEvent[]>(STORAGE_KEYS.otherEvents, []);
  saveToLocalStorage(STORAGE_KEYS.otherEvents, currentOtherEvents.filter(e => e.id !== id));

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
  const storedOtherEvents = getFromLocalStorage<OtherEvent[]>(STORAGE_KEYS.otherEvents, []);

  if (!isSupabaseConfigured()) {
    return storedOtherEvents;
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_type', 'otro')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching other events:', error);
    // Only use localStorage as fallback when Supabase is unreachable
    return storedOtherEvents;
  }

  // Supabase is the source of truth — save its result and return it
  const events = data.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    category: event.category || '',
    description: event.description,
    imageUrl: event.image_url,
  }));

  saveToLocalStorage(STORAGE_KEYS.otherEvents, events);
  return events;
}

export async function createOtherEvent(event: Omit<OtherEvent, 'id'>): Promise<OtherEvent | null> {
  const newEvent: OtherEvent = {
    ...event,
    id: Date.now().toString(),
  };

  // ALWAYS save to localStorage first as backup
  const currentEvents = getFromLocalStorage<OtherEvent[]>(STORAGE_KEYS.otherEvents, []);
  saveToLocalStorage(STORAGE_KEYS.otherEvents, [newEvent, ...currentEvents]);

  if (!isSupabaseConfigured()) {
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
    return newEvent; // Already saved to localStorage
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
    const currentEvents = getFromLocalStorage<OtherEvent[]>(STORAGE_KEYS.otherEvents, []);
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
  // Always check localStorage first as it might have user-saved data
  const storedIds = getFromLocalStorage<string[]>(STORAGE_KEYS.featuredArtworkIds, []);

  if (!isSupabaseConfigured()) {
    return storedIds;
  }

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'featured_artwork_ids')
    .single();

  if (error) {
    // If no setting found in Supabase, fall back to localStorage
    if (error.code === 'PGRST116') {
      return storedIds;
    }
    console.error('Error fetching featured artwork IDs:', error);
    return storedIds;
  }

  // If Supabase returns empty but we have localStorage data, use localStorage
  const ids = data?.value || [];
  if (ids.length === 0 && storedIds.length > 0) {
    return storedIds;
  }

  // If Supabase has data, also save to localStorage as backup
  if (ids.length > 0) {
    saveToLocalStorage(STORAGE_KEYS.featuredArtworkIds, ids);
  }

  return ids;
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
