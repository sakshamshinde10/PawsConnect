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
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          location: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          location?: string | null;
          bio?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      pets: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          type: string;
          breed: string;
          age: string;
          gender: string;
          vaccinated: boolean;
          price: number;
          location: string;
          description: string;
          images: string[];
          video_url: string | null;
          is_live: boolean;
          is_featured: boolean;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          type: string;
          breed: string;
          age: string;
          gender: string;
          vaccinated?: boolean;
          price?: number;
          location: string;
          description: string;
          images?: string[];
          video_url?: string | null;
          is_live?: boolean;
          is_featured?: boolean;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          type?: string;
          breed?: string;
          age?: string;
          gender?: string;
          vaccinated?: boolean;
          price?: number;
          location?: string;
          description?: string;
          images?: string[];
          video_url?: string | null;
          is_live?: boolean;
          is_featured?: boolean;
          is_available?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey";
            columns: ["owner_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          pet_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pet_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          pet_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "favorites_pet_id_fkey";
            columns: ["pet_id"];
            referencedRelation: "pets";
            referencedColumns: ["id"];
          }
        ];
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          pet_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          pet_id: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          is_read?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_receiver_id_fkey";
            columns: ["receiver_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_pet_id_fkey";
            columns: ["pet_id"];
            referencedRelation: "pets";
            referencedColumns: ["id"];
          }
        ];
      };
      adoption_requests: {
        Row: {
          id: string;
          pet_id: string;
          requester_id: string;
          owner_id: string;
          status: string;
          message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          requester_id: string;
          owner_id: string;
          status?: string;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "adoption_requests_pet_id_fkey";
            columns: ["pet_id"];
            referencedRelation: "pets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "adoption_requests_requester_id_fkey";
            columns: ["requester_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "adoption_requests_owner_id_fkey";
            columns: ["owner_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
