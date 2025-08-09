export interface Database {
  public: {
    Tables: {
      communities: {
        Row: {
          id: string;
          name: string;
          description: string;
          categories: string[];
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          categories?: string[];
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          categories?: string[];
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          bio: string | null;
          age: number | null;
          location: string | null;
          skills: string[];
          interests: string[];
          role: 'mentor' | 'mentee' | 'both';
          experience: string | null;
          availability: string | null;
          rating: number | null;
          review_count: number;
          preferred_meeting_style: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          bio?: string | null;
          age?: number | null;
          location?: string | null;
          skills?: string[];
          interests?: string[];
          role?: 'mentor' | 'mentee' | 'both';
          experience?: string | null;
          availability?: string | null;
          rating?: number | null;
          review_count?: number;
          preferred_meeting_style?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          bio?: string | null;
          age?: number | null;
          location?: string | null;
          skills?: string[];
          interests?: string[];
          role?: 'mentor' | 'mentee' | 'both';
          experience?: string | null;
          availability?: string | null;
          rating?: number | null;
          review_count?: number;
          preferred_meeting_style?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          community_id: string;
          author_id: string;
          title: string;
          content: string;
          tags: string[];
          likes: number;
          replies: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          author_id: string;
          title: string;
          content: string;
          tags?: string[];
          likes?: number;
          replies?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          tags?: string[];
          likes?: number;
          replies?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      community_members: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          user_id?: string;
          joined_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier use in components
export type Community = Database['public']['Tables']['communities']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];
export type CommunityMember = Database['public']['Tables']['community_members']['Row'];

// Extended types with joined data
export type PostWithAuthor = Post & {
  profiles: Pick<Profile, 'name' | 'age' | 'role'>;
};

export type CommunityWithStats = Community & {
  member_count: number;
  post_count: number;
};

export type ProfileWithInitials = Profile & {
  initials: string;
};