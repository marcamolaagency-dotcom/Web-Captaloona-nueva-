import { useState, useEffect, useCallback } from 'react';
import {
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  getArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getOtherEvents,
  createOtherEvent,
  deleteOtherEvent,
  getFeaturedArtworkIds,
  saveFeaturedArtworkIds,
} from './database';
import type { Artwork, EventItem, OtherEvent, Artist } from '../types';

interface UseDataReturn {
  // Data
  artists: Artist[];
  artworks: Artwork[];
  events: EventItem[];
  otherEvents: OtherEvent[];
  featuredArtworkIds: string[];

  // Loading states
  loading: boolean;
  error: string | null;

  // Actions
  addArtist: (artist: Omit<Artist, 'id'>) => Promise<void>;
  editArtist: (id: string, updates: Partial<Artist>) => Promise<void>;
  removeArtist: (id: string) => Promise<void>;

  addArtwork: (artwork: Omit<Artwork, 'id'>) => Promise<void>;
  editArtwork: (id: string, updates: Partial<Artwork>) => Promise<void>;
  removeArtwork: (id: string) => Promise<void>;

  addEvent: (event: Omit<EventItem, 'id'>) => Promise<void>;
  editEvent: (id: string, updates: Partial<EventItem>) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;

  addOtherEvent: (event: Omit<OtherEvent, 'id'>) => Promise<void>;
  removeOtherEvent: (id: string) => Promise<void>;

  // For backwards compatibility with existing code
  setArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
  setArtworks: React.Dispatch<React.SetStateAction<Artwork[]>>;
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  setOtherEvents: React.Dispatch<React.SetStateAction<OtherEvent[]>>;
  setFeaturedArtworkIds: (ids: string[]) => void;

  // Refresh data
  refresh: () => Promise<void>;
}

export function useData(): UseDataReturn {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [otherEvents, setOtherEvents] = useState<OtherEvent[]>([]);
  const [featuredArtworkIds, setFeaturedArtworkIdsState] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wrapper to save to Supabase and localStorage when updating featured IDs
  const setFeaturedArtworkIds = useCallback(async (ids: string[]) => {
    setFeaturedArtworkIdsState(ids);
    await saveFeaturedArtworkIds(ids);
  }, []);

  // Load all data on mount
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [artistsData, artworksData, eventsData, otherEventsData, featuredIds] = await Promise.all([
        getArtists(),
        getArtworks(),
        getEvents(),
        getOtherEvents(),
        getFeaturedArtworkIds(),
      ]);

      // Clean up orphaned featured artwork IDs
      const validFeaturedIds = artworksData.length > 0
        ? featuredIds.filter(id => artworksData.some(artwork => artwork.id === id))
        : featuredIds;

      if (artworksData.length > 0 && validFeaturedIds.length !== featuredIds.length) {
        console.log('Cleaned up orphaned featured artwork IDs');
        await saveFeaturedArtworkIds(validFeaturedIds);
      }

      setArtists(artistsData);
      setArtworks(artworksData);
      setEvents(eventsData);
      setOtherEvents(otherEventsData);
      setFeaturedArtworkIdsState(validFeaturedIds);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar los datos. Usando datos locales.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Artist actions
  const addArtist = async (artist: Omit<Artist, 'id'>) => {
    const newArtist = await createArtist(artist);
    if (newArtist) {
      setArtists((prev) => [...prev, newArtist]);
    } else {
      // Fallback to local state
      const localArtist: Artist = {
        ...artist,
        id: artist.name.toLowerCase().replace(/\s+/g, '-'),
      };
      setArtists((prev) => [...prev, localArtist]);
    }
  };

  const editArtist = async (id: string, updates: Partial<Artist>) => {
    await updateArtist(id, updates);
    setArtists((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const removeArtist = async (id: string) => {
    const success = await deleteArtist(id);
    if (success || !success) {
      // Update local state regardless
      setArtists((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Artwork actions
  const addArtwork = async (artwork: Omit<Artwork, 'id'>) => {
    const newArtwork = await createArtwork(artwork);
    if (newArtwork) {
      setArtworks((prev) => [newArtwork, ...prev]);
    } else {
      // Fallback to local state
      const localArtwork: Artwork = {
        ...artwork,
        id: Date.now().toString(),
      };
      setArtworks((prev) => [localArtwork, ...prev]);
    }
  };

  const editArtwork = async (id: string, updates: Partial<Artwork>) => {
    await updateArtwork(id, updates);
    setArtworks((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const removeArtwork = async (id: string) => {
    await deleteArtwork(id);
    setArtworks((prev) => prev.filter((a) => a.id !== id));
  };

  // Event actions
  const addEvent = async (event: Omit<EventItem, 'id'>) => {
    const newEvent = await createEvent(event);
    if (newEvent) {
      setEvents((prev) => [newEvent, ...prev]);
    } else {
      const localEvent: EventItem = {
        ...event,
        id: Date.now().toString(),
      };
      setEvents((prev) => [localEvent, ...prev]);
    }
  };

  const editEvent = async (id: string, updates: Partial<EventItem>) => {
    await updateEvent(id, updates);
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const removeEvent = async (id: string) => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Other event actions
  const addOtherEvent = async (event: Omit<OtherEvent, 'id'>) => {
    const newEvent = await createOtherEvent(event);
    if (newEvent) {
      setOtherEvents((prev) => [newEvent, ...prev]);
    } else {
      const localEvent: OtherEvent = {
        ...event,
        id: Date.now().toString(),
      };
      setOtherEvents((prev) => [localEvent, ...prev]);
    }
  };

  const removeOtherEvent = async (id: string) => {
    await deleteOtherEvent(id);
    setOtherEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    artists,
    artworks,
    events,
    otherEvents,
    featuredArtworkIds,
    loading,
    error,
    addArtist,
    editArtist,
    removeArtist,
    addArtwork,
    editArtwork,
    removeArtwork,
    addEvent,
    editEvent,
    removeEvent,
    addOtherEvent,
    removeOtherEvent,
    setArtists,
    setArtworks,
    setEvents,
    setOtherEvents,
    setFeaturedArtworkIds,
    refresh: loadData,
  };
}

export default useData;
