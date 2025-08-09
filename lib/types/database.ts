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
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          organizer_id: string;
          event_type: 'workshop' | 'meetup' | 'mentoring_session' | 'discussion' | 'other';
          location: string;
          latitude: number;
          longitude: number;
          start_time: string;
          end_time: string;
          max_attendees?: number;
          attendee_count: number;
          is_online: boolean;
          meeting_link?: string;
          tags: string[];
          community_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          organizer_id: string;
          event_type?: 'workshop' | 'meetup' | 'mentoring_session' | 'discussion' | 'other';
          location: string;
          latitude: number;
          longitude: number;
          start_time: string;
          end_time: string;
          max_attendees?: number;
          attendee_count?: number;
          is_online?: boolean;
          meeting_link?: string;
          tags?: string[];
          community_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          organizer_id?: string;
          event_type?: 'workshop' | 'meetup' | 'mentoring_session' | 'discussion' | 'other';
          location?: string;
          latitude?: number;
          longitude?: number;
          start_time?: string;
          end_time?: string;
          max_attendees?: number;
          attendee_count?: number;
          is_online?: boolean;
          meeting_link?: string;
          tags?: string[];
          community_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_attendees: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          rsvp_status: 'attending' | 'maybe' | 'not_attending';
          joined_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          rsvp_status?: 'attending' | 'maybe' | 'not_attending';
          joined_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          rsvp_status?: 'attending' | 'maybe' | 'not_attending';
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
export type Event = Database['public']['Tables']['events']['Row'];
export type EventAttendee = Database['public']['Tables']['event_attendees']['Row'];

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

export type EventWithOrganizer = Event & {
  organizer: Pick<Profile, 'name' | 'age' | 'role'>;
  attendee_count: number;
  user_rsvp_status?: 'attending' | 'maybe' | 'not_attending' | null;
};