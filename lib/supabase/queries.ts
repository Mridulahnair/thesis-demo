import { createClient } from './client';
import type { Database, Profile, PostWithAuthor, CommunityWithStats, ProfileWithInitials } from '../types/database';

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