export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      organisations: {
        Row: {
          id: string; name: string; slug: string; email: string | null; phone: string | null;
          website: string | null; address: string | null; country: string | null; brokerage_type: string | null;
          company_size: string | null; plan: string; plan_credits_remaining: number;
          plan_credits_reset_at: string | null; logo_url: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['organisations']['Row']> & { name: string; slug: string };
        Update: Partial<Database['public']['Tables']['organisations']['Row']>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string; email: string; full_name: string | null; first_name: string | null; last_name: string | null;
          avatar_url: string | null; phone: string | null; job_title: string | null;
          onboarding_completed: boolean; created_at: string; updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string; email: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
        Relationships: [];
      };
      organisation_members: {
        Row: { id: string; organisation_id: string; user_id: string; role: string; invited_by: string | null; joined_at: string; created_at: string };
        Insert: Omit<Database['public']['Tables']['organisation_members']['Row'], 'id' | 'joined_at' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['organisation_members']['Row']>;
        Relationships: [];
      };
      organisation_invitations: {
        Row: { id: string; organisation_id: string; email: string; role: string; token: string; invited_by: string | null; accepted_at: string | null; expires_at: string; created_at: string };
        Insert: Omit<Database['public']['Tables']['organisation_invitations']['Row'], 'id' | 'token' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['organisation_invitations']['Row']>;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string; organisation_id: string; assigned_to: string | null; first_name: string;
          last_name: string; email: string | null; phone: string | null; company: string | null;
          industry: string | null; client_type: string; status: string; source: string | null;
          tags: string[] | null; notes: string | null; created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clients']['Row']>;
        Relationships: [];
      };
      client_notes: {
        Row: { id: string; client_id: string; organisation_id: string; author_id: string | null; content: string; created_at: string };
        Insert: Omit<Database['public']['Tables']['client_notes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['client_notes']['Row']>;
        Relationships: [];
      };
      client_activities: {
        Row: { id: string; client_id: string; organisation_id: string; user_id: string | null; activity_type: string; title: string; description: string | null; metadata: Json; created_at: string };
        Insert: Omit<Database['public']['Tables']['client_activities']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['client_activities']['Row']>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string; organisation_id: string; assigned_to: string | null; first_name: string;
          last_name: string; email: string | null; phone: string | null; company: string | null;
          source: string | null; status: string; notes: string | null;
          converted_client_id: string | null; converted_at: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['leads']['Row']>;
        Relationships: [];
      };
      deals: {
        Row: {
          id: string; organisation_id: string; client_id: string | null; owner_id: string | null;
          title: string; value: number | null; currency: string; stage: string;
          probability: number | null; expected_close_date: string | null;
          lost_reason: string | null; notes: string | null; created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['deals']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['deals']['Row']>;
        Relationships: [];
      };
      deal_activities: {
        Row: { id: string; deal_id: string; organisation_id: string; user_id: string | null; from_stage: string | null; to_stage: string | null; note: string | null; created_at: string };
        Insert: Omit<Database['public']['Tables']['deal_activities']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['deal_activities']['Row']>;
        Relationships: [];
      };
      meetings: {
        Row: {
          id: string; organisation_id: string; created_by: string | null; client_id: string | null;
          deal_id: string | null; title: string; meeting_type: string; status: string;
          scheduled_at: string | null; duration_minutes: number | null; location: string | null;
          notes: string | null; transcript: string | null; ai_summary: string | null;
          action_items: Json; created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['meetings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['meetings']['Row']>;
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string; organisation_id: string; created_by: string | null; assigned_to: string | null;
          client_id: string | null; deal_id: string | null; title: string; description: string | null;
          status: string; priority: string; due_date: string | null; completed_at: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tasks']['Row']>;
        Relationships: [];
      };
      documents: {
        Row: {
          id: string; organisation_id: string; uploaded_by: string | null; client_id: string | null;
          name: string; storage_path: string; mime_type: string | null; size_bytes: number | null;
          category: string | null; ai_summary: string | null; tags: string[] | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['documents']['Row']>;
        Relationships: [];
      };
      ai_conversations: {
        Row: { id: string; organisation_id: string; user_id: string; title: string | null; created_at: string; updated_at: string };
        Insert: Omit<Database['public']['Tables']['ai_conversations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['ai_conversations']['Row']>;
        Relationships: [];
      };
      ai_messages: {
        Row: { id: string; conversation_id: string; role: string; content: string; metadata: Json; created_at: string };
        Insert: Omit<Database['public']['Tables']['ai_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ai_messages']['Row']>;
        Relationships: [];
      };
      notifications: {
        Row: { id: string; organisation_id: string; user_id: string; title: string; body: string | null; type: string; read: boolean; metadata: Json; created_at: string };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
