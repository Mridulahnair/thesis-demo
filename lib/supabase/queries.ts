import { createClient } from './client';
import type { Database, Profile, PostWithAuthor, CommunityWithStats, ProfileWithInitials, EventWithOrganizer } from '../types/database';

export class DatabaseService {
  private supabase: ReturnType<typeof createClient> | null;

  constructor() {
    try {
      this.supabase = createClient();
    } catch (error) {
      console.warn('Supabase client creation failed:', error);
      this.supabase = null;
    }
  }

  private checkClient() {
    if (!this.supabase) {
      throw new Error('Supabase client is not initialized. Please check your environment variables.');
    }
    return this.supabase;
  }

  // Communities
  async getCommunities(): Promise<CommunityWithStats[]> {
    const supabase = this.checkClient();
    const { data, error } = await supabase
      .from('communities')
      .select(`
        *,
        member_count:community_members(count),
        post_count:posts(count)
      `)
      .order('featured', { ascending: false })
      .order('name');

    if (error) {
      console.error('Error fetching communities:', error);
      throw error;
    }

    return data?.map(community => ({
      ...community,
      member_count: community.member_count?.[0]?.count || 0,
      post_count: community.post_count?.[0]?.count || 0,
    })) || [];
  }

  async getCommunity(id: string): Promise<CommunityWithStats | null> {
    const { data, error } = await this.checkClient()
      .from('communities')
      .select(`
        *,
        member_count:community_members(count),
        post_count:posts(count)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching community:', error);
      return null;
    }

    if (!data) return null;

    return {
      ...data,
      member_count: data.member_count?.[0]?.count || 0,
      post_count: data.post_count?.[0]?.count || 0,
    };
  }

  // Posts
  async getPostsForCommunity(communityId: string): Promise<PostWithAuthor[]> {
    const { data, error } = await this.checkClient()
      .from('posts')
      .select(`
        *,
        profiles:author_id (
          name,
          age,
          role
        )
      `)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }

    return data?.map(post => ({
      ...post,
      profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles,
    })) || [];
  }

  async createPost(post: Database['public']['Tables']['posts']['Insert']) {
    const { data, error } = await this.checkClient()
      .from('posts')
      .insert(post)
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }

    return data;
  }

  async getPost(postId: string): Promise<PostWithAuthor | null> {
    const { data, error } = await this.checkClient()
      .from('posts')
      .select(`
        *,
        profiles:author_id (
          name,
          age,
          role
        )
      `)
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }

    if (!data) return null;

    return {
      ...data,
      profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
    };
  }

  // Community Members
  async getCommunityMembers(communityId: string): Promise<ProfileWithInitials[]> {
    const { data, error } = await this.checkClient()
      .from('community_members')
      .select(`
        profiles (*)
      `)
      .eq('community_id', communityId);

    if (error) {
      console.error('Error fetching community members:', error);
      throw error;
    }

    return data?.map(member => {
      const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
      return {
        ...profile,
        initials: this.getInitials(profile.name || ''),
      };
    }) || [];
  }

  async joinCommunity(communityId: string, userId: string) {
    const { data, error } = await this.checkClient()
      .from('community_members')
      .insert({ community_id: communityId, user_id: userId })
      .select()
      .single();

    if (error) {
      console.error('Error joining community:', error);
      throw error;
    }

    return data;
  }

  async checkCommunityMembership(communityId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.checkClient()
      .from('community_members')
      .select('*')
      .eq('community_id', communityId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking community membership:', error);
      throw error;
    }

    return !!data;
  }

  async leaveCommunity(communityId: string, userId: string) {
    const { error } = await this.checkClient()
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error leaving community:', error);
      throw error;
    }
  }

  // Connection system for mentors/mentees (simplified for demo)
  async sendConnectionRequest(fromUserId: string, toUserId: string, message: string) {
    // For demo purposes, we'll just log the connection request
    // In a real app, you'd have a connections table and messaging system
    console.log(`Connection request from ${fromUserId} to ${toUserId}: ${message}`);
    return { success: true };
  }

  async checkExistingConnection(): Promise<boolean> {
    // For demo purposes, always return false (no existing connections)
    // In a real app, you'd check a connections table
    return false;
  }

  // Profiles/People (for search)
  async searchPeople(query: string = '', role?: 'mentor' | 'mentee' | 'both'): Promise<ProfileWithInitials[]> {
    let queryBuilder = this.checkClient()
      .from('profiles')
      .select('*');

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,bio.ilike.%${query}%,skills.cs.{${query}}`);
    }

    if (role && role !== 'both') {
      queryBuilder = queryBuilder.or(`role.eq.${role},role.eq.both`);
    }

    const { data, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error searching people:', error);
      throw error;
    }

    return data?.map(profile => ({
      ...profile,
      initials: this.getInitials(profile.name || ''),
    })) || [];
  }

  // Search across communities and people
  async search(query: string): Promise<{
    communities: CommunityWithStats[];
    people: ProfileWithInitials[];
  }> {
    const [communities, people] = await Promise.all([
      this.searchCommunities(query),
      this.searchPeople(query),
    ]);

    return { communities, people };
  }

  async searchCommunities(query: string): Promise<CommunityWithStats[]> {
    const { data, error } = await this.checkClient()
      .from('communities')
      .select(`
        *,
        member_count:community_members(count),
        post_count:posts(count)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,categories.cs.{${query}}`)
      .order('featured', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error searching communities:', error);
      throw error;
    }

    return data?.map(community => ({
      ...community,
      member_count: community.member_count?.[0]?.count || 0,
      post_count: community.post_count?.[0]?.count || 0,
    })) || [];
  }

  // Profile management
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.checkClient()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  async updateProfile(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
    const { data, error } = await this.checkClient()
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  }

  // Events
  async getEvents(): Promise<EventWithOrganizer[]> {
    // For demo purposes, return mock events with coordinates around Limerick, Ireland
    // In a real app, you'd query the database with geospatial filters
    const mockEvents: EventWithOrganizer[] = [
      {
        id: "event-1",
        title: "Technology for Seniors - UL Community Hub",
        description: "Learn smartphones, tablets, and essential apps with patient young volunteers from University of Limerick. Tea and biscuits provided!",
        organizer_id: "11111111-1111-1111-1111-111111111111",
        event_type: "workshop",
        location: "University of Limerick, Main Campus",
        latitude: 52.6747,
        longitude: -8.5721,
        start_time: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        end_time: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString(), // 2 hours later
        max_attendees: 15,
        attendee_count: 8,
        is_online: false,
        tags: ["Technology", "Smartphones", "Seniors", "UL"],
        community_id: "tech-digital",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organizer: {
          name: "Niamh O'Sullivan",
          age: 22,
          role: "mentee"
        }
      },
      {
        id: "event-2", 
        title: "Traditional Irish Soda Bread Workshop",
        description: "Learn to make authentic Irish soda bread from Limerick locals who've been baking for decades. Share stories over tea while the bread rises!",
        organizer_id: "33333333-3333-3333-3333-333333333333",
        event_type: "workshop",
        location: "Limerick Community Kitchen, King's Island",
        latitude: 52.6686,
        longitude: -8.6236,
        start_time: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
        end_time: new Date(Date.now() + 86400000 * 5 + 10800000).toISOString(), // 3 hours later
        max_attendees: 12,
        attendee_count: 6,
        is_online: false,
        tags: ["Irish Tradition", "Soda Bread", "Baking", "Community"],
        community_id: "cooking-culinary",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organizer: {
          name: "Mary O'Brien",
          age: 68,
          role: "mentor"
        }
      },
      {
        id: "event-3",
        title: "Business Mentoring - Limerick Chamber",
        description: "Connect with experienced Limerick entrepreneurs and business leaders. Perfect for young professionals looking to start their own ventures in the Mid-West region.",
        organizer_id: "77777777-7777-7777-7777-777777777777",
        event_type: "mentoring_session",
        location: "Limerick Chamber of Commerce, O'Connell Street",
        latitude: 52.6647,
        longitude: -8.6249,
        start_time: new Date(Date.now() + 86400000 * 1).toISOString(), // Tomorrow
        end_time: new Date(Date.now() + 86400000 * 1 + 3600000).toISOString(), // 1 hour later
        max_attendees: 8,
        attendee_count: 4,
        is_online: false,
        tags: ["Business", "Entrepreneurship", "Mentoring", "Limerick"],
        community_id: "career-business",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organizer: {
          name: "Seán Murphy",
          age: 54,
          role: "mentor"
        }
      },
      {
        id: "event-4",
        title: "Sketching the Shannon - Art by the River",
        description: "Join us for outdoor sketching along the beautiful River Shannon. Local artists will share techniques while we capture Limerick's scenic riverside. All skill levels welcome!",
        organizer_id: "55555555-5555-5555-5555-555555555555",
        event_type: "workshop",
        location: "Arthur's Quay Park, River Shannon",
        latitude: 52.6656,
        longitude: -8.6238,
        start_time: new Date(Date.now() + 86400000 * 7).toISOString(), // 1 week from now
        end_time: new Date(Date.now() + 86400000 * 7 + 9000000).toISOString(), // 2.5 hours later
        max_attendees: 10,
        attendee_count: 4,
        is_online: false,
        tags: ["Art", "Sketching", "Shannon", "Outdoor"],
        community_id: "creative-arts",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organizer: {
          name: "Aoife Kelly",
          age: 47,
          role: "mentor"
        }
      },
      {
        id: "event-5",
        title: "🔴 LIVE: Traditional Irish Music Session",
        description: "Master musician Paddy is teaching traditional tunes LIVE! Join 18 others learning fiddle, bodhrán, and tin whistle. Beginners welcome - instruments provided!",
        organizer_id: "77777777-7777-7777-7777-777777777777", 
        event_type: "discussion",
        location: "Dolan's Pub Traditional Music Room",
        latitude: 52.6635,
        longitude: -8.6272,
        start_time: new Date(Date.now() - 1800000).toISOString(), // Started 30 minutes ago
        end_time: new Date(Date.now() + 3600000).toISOString(), // Ends in 1 hour
        max_attendees: 25,
        attendee_count: 18,
        is_online: false,
        tags: ["Traditional Music", "Live", "Fiddle", "Irish Culture"],
        community_id: "music-performance",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organizer: {
          name: "Paddy Ó Ceardách",
          age: 71,
          role: "mentor"
        }
      },
      {
        id: "event-6",
        title: "🌟 Starting Soon: Coffee & Tech Help",
        description: "Informal coffee meetup where UL students help locals with smartphones, WhatsApp, online banking and more. Relaxed atmosphere at Limerick's favorite café!",
        organizer_id: "22222222-2222-2222-2222-222222222222",
        event_type: "meetup", 
        location: "Java's Coffee Shop, O'Connell Street",
        latitude: 52.6642,
        longitude: -8.6236,
        start_time: new Date(Date.now() + 900000).toISOString(), // Starts in 15 minutes
        end_time: new Date(Date.now() + 9000000).toISOString(), // 2.5 hours long
        max_attendees: 20,
        attendee_count: 14,
        is_online: false,
        tags: ["Tech Help", "Coffee", "UL Students", "Digital Skills"],
        community_id: "tech-digital", 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organizer: {
          name: "Cian Ó Brádaigh",
          age: 20,
          role: "mentee"
        }
      },
      {
        id: "event-7", 
        title: "Irish Garden Planning & Potato Growing",
        description: "Learn traditional Irish gardening from local experts! Focus on potato varieties, root vegetables, and herbs that thrive in Limerick's climate. Sharing seeds and stories!",
        organizer_id: "99999999-9999-9999-9999-999999999999",
        event_type: "workshop",
        location: "People's Park Community Garden", 
        latitude: 52.6597,
        longitude: -8.6267,
        start_time: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        end_time: new Date(Date.now() + 86400000 * 3 + 7200000).toISOString(), // 2 hours
        max_attendees: 15,
        attendee_count: 9,
        is_online: false,
        tags: ["Irish Gardening", "Potatoes", "Traditional", "Community"],
        community_id: "gardening-sustainability",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organizer: {
          name: "Brigid Fitzgerald", 
          age: 72,
          role: "mentor"
        }
      },
      {
        id: "event-8",
        title: "Irish & European Language Exchange",
        description: "Practice Irish Gaeilge, French, German, and Polish with international students and locals! Perfect for UL students and Limerick residents. Cúpla focal welcome!",
        organizer_id: "13131313-1313-1313-1313-131313131313",
        event_type: "meetup",
        location: "Limerick City Library, The Granary",
        latitude: 52.6679,
        longitude: -8.6230,
        start_time: new Date(Date.now() + 86400000 * 4).toISOString(), // 4 days from now
        end_time: new Date(Date.now() + 86400000 * 4 + 5400000).toISOString(), // 1.5 hours
        max_attendees: 16,
        attendee_count: 10,
        is_online: false,
        tags: ["Irish", "Gaeilge", "Language Exchange", "European"],
        community_id: "languages-culture",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organizer: {
          name: "Máire Ní Dhomhnaill",
          age: 56,
          role: "mentor" 
        }
      },
      {
        id: "event-9",
        title: "🎵 LIVE NOW: Irish Storytelling & Poetry", 
        description: "Seán is sharing traditional Irish stories and poetry LIVE! Join 22 others discovering the oral traditions of Limerick and Munster. Stories in English and Irish.",
        organizer_id: "15151515-1515-1515-1515-151515151515",
        event_type: "discussion",
        location: "Frank McCourt Museum",
        latitude: 52.6653,
        longitude: -8.6247,
        start_time: new Date(Date.now() - 2700000).toISOString(), // Started 45 minutes ago
        end_time: new Date(Date.now() + 1800000).toISOString(), // 30 minutes left
        max_attendees: 30,
        attendee_count: 22,
        is_online: false,
        tags: ["Storytelling", "Poetry", "Irish Culture", "Live"],
        community_id: "languages-culture",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organizer: {
          name: "Seán Ó Riain",
          age: 68,
          role: "mentor"
        }
      },
      {
        id: "event-10",
        title: "Shannon Riverside Walk & Wellness Chat",
        description: "Join local wellness advocates for a gentle walk along the beautiful Shannon riverside. Share health tips, mindfulness practices, and enjoy Limerick's fresh air!",
        organizer_id: "11111111-1111-1111-1111-111111111112",
        event_type: "meetup",
        location: "University of Limerick Living Bridge", 
        latitude: 52.6725,
        longitude: -8.5745,
        start_time: new Date(Date.now() + 86400000 * 1).toISOString(), // Tomorrow
        end_time: new Date(Date.now() + 86400000 * 1 + 3600000).toISOString(), // 1 hour
        max_attendees: 12,
        attendee_count: 7,
        is_online: false,
        tags: ["Walking", "Shannon", "Wellness", "Mindfulness"],
        community_id: "health-wellness",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organizer: {
          name: "Dr. Siobhán Murphy",
          age: 52,
          role: "mentor"
        }
      }
    ];

    return mockEvents;
  }

  async getEvent(eventId: string): Promise<EventWithOrganizer | null> {
    const events = await this.getEvents();
    return events.find(event => event.id === eventId) || null;
  }

  async createEvent(eventData: Database['public']['Tables']['events']['Insert']): Promise<{ success: boolean; id: string }> {
    // For demo purposes, just return success
    console.log('Creating event:', eventData);
    return { success: true, id: Date.now().toString() };
  }

  async rsvpToEvent(eventId: string, userId: string, status: 'attending' | 'maybe' | 'not_attending'): Promise<{ success: boolean }> {
    // For demo purposes, just log the RSVP
    console.log(`User ${userId} RSVP'd ${status} to event ${eventId}`);
    return { success: true };
  }

  // Utility functions
  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

// Export singleton instance
export const db = new DatabaseService();