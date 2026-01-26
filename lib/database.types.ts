// Database types generated from Supabase schema
// These types provide type safety for all database operations

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string;
          name: string;
          bio: string;
          image_url: string;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          bio: string;
          image_url: string;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          bio?: string;
          image_url?: string;
          location?: string | null;
          updated_at?: string;
        };
      };
      artworks: {
        Row: {
          id: string;
          title: string;
          artist_id: string;
          medium: string;
          size: string;
          price: number;
          image_url: string;
          category: 'Pintura' | 'Escultura' | 'Poesía' | 'Narrativa';
          status: 'disponible' | 'vendido';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          artist_id: string;
          medium: string;
          size: string;
          price: number;
          image_url: string;
          category: 'Pintura' | 'Escultura' | 'Poesía' | 'Narrativa';
          status?: 'disponible' | 'vendido';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          artist_id?: string;
          medium?: string;
          size?: string;
          price?: number;
          image_url?: string;
          category?: 'Pintura' | 'Escultura' | 'Poesía' | 'Narrativa';
          status?: 'disponible' | 'vendido';
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          date: string;
          location: string;
          description: string;
          image_url: string;
          event_type: 'exposicion' | 'otro';
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          date: string;
          location: string;
          description: string;
          image_url: string;
          event_type?: 'exposicion' | 'otro';
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          date?: string;
          location?: string;
          description?: string;
          image_url?: string;
          event_type?: 'exposicion' | 'otro';
          category?: string | null;
          updated_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
      };
      settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          value?: Json;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      artwork_category: 'Pintura' | 'Escultura' | 'Poesía' | 'Narrativa';
      artwork_status: 'disponible' | 'vendido';
      event_type: 'exposicion' | 'otro';
    };
  };
}

// Helper types for easier usage
export type Artist = Database['public']['Tables']['artists']['Row'];
export type ArtistInsert = Database['public']['Tables']['artists']['Insert'];
export type ArtistUpdate = Database['public']['Tables']['artists']['Update'];

export type Artwork = Database['public']['Tables']['artworks']['Row'];
export type ArtworkInsert = Database['public']['Tables']['artworks']['Insert'];
export type ArtworkUpdate = Database['public']['Tables']['artworks']['Update'];

export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

export type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert'];
