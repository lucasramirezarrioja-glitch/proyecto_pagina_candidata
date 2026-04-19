export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      biography_sections: {
        Row: {
          body: string
          deleted_at: string | null
          id: string
          is_published: boolean
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          deleted_at?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          deleted_at?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_content: {
        Row: {
          claim: string
          disclaimer: string
          headline: string
          id: string
          image_url: string | null
          primary_cta_label: string
          secondary_cta_label: string
          subheadline: string | null
          updated_at: string
        }
        Insert: {
          claim: string
          disclaimer: string
          headline: string
          id?: string
          image_url?: string | null
          primary_cta_label?: string
          secondary_cta_label?: string
          subheadline?: string | null
          updated_at?: string
        }
        Update: {
          claim?: string
          disclaimer?: string
          headline?: string
          id?: string
          image_url?: string | null
          primary_cta_label?: string
          secondary_cta_label?: string
          subheadline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          deleted_at: string | null
          description: string | null
          id: string
          is_published: boolean
          order_index: number
          title: string
          updated_at: string
          year: number
        }
        Insert: {
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          title: string
          updated_at?: string
          year: number
        }
        Update: {
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          title?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      news_items: {
        Row: {
          deleted_at: string | null
          id: string
          image_url: string | null
          is_pinned: boolean
          is_published: boolean
          published_at: string
          source_name: string | null
          source_url: string | null
          summary: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          is_published?: boolean
          published_at?: string
          source_name?: string | null
          source_url?: string | null
          summary: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          is_published?: boolean
          published_at?: string
          source_name?: string | null
          source_url?: string | null
          summary?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      supporters: {
        Row: {
          consent_accepted: boolean
          consent_version: string
          created_at: string
          deleted_at: string | null
          email: string
          full_name: string
          id: string
          ip_hash: string | null
          municipality: string | null
          phone: string | null
          role: string
          user_agent: string | null
        }
        Insert: {
          consent_accepted?: boolean
          consent_version?: string
          created_at?: string
          deleted_at?: string | null
          email: string
          full_name: string
          id?: string
          ip_hash?: string | null
          municipality?: string | null
          phone?: string | null
          role: string
          user_agent?: string | null
        }
        Update: {
          consent_accepted?: boolean
          consent_version?: string
          created_at?: string
          deleted_at?: string | null
          email?: string
          full_name?: string
          id?: string
          ip_hash?: string | null
          municipality?: string | null
          phone?: string | null
          role?: string
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
