
import { supabase } from '@/integrations/supabase/client';
import { Post, Event } from '@/types';

// Fetch all discussions
export const fetchDiscussions = async (): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data) return [];
    
    const postsWithAuthors = await Promise.all(
      data.map(async (post) => {
        // Fetch author profile separately
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name, role, avatar_url')
          .eq('id', post.author_id)
          .single();
        
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.author_id,
          authorName: profileData?.name || 'Anonymous',
          authorRole: profileData?.role || 'consumer',
          authorImageUrl: profileData?.avatar_url,
          createdAt: post.created_at,
          likes: post.likes || 0,
          comments: post.comments || 0,
          tags: post.tags || [],
        };
      })
    );
    
    return postsWithAuthors;
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return [];
  }
};

// Create a new discussion
export const createDiscussion = async (postData: Partial<Post>): Promise<Post | null> => {
  try {
    if (!postData.authorId || !postData.title || !postData.content) {
      throw new Error('Author ID, title, and content are required');
    }
    
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: postData.title,
        content: postData.content,
        author_id: postData.authorId,
        tags: postData.tags || [],
      })
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Fetch author profile separately
    const { data: profileData } = await supabase
      .from('profiles')
      .select('name, role, avatar_url')
      .eq('id', data.author_id)
      .single();
    
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      authorId: data.author_id,
      authorName: profileData?.name || 'Anonymous',
      authorRole: profileData?.role || 'consumer',
      authorImageUrl: profileData?.avatar_url,
      createdAt: data.created_at,
      likes: data.likes || 0,
      comments: data.comments || 0,
      tags: data.tags || [],
    };
  } catch (error) {
    console.error('Error creating discussion:', error);
    return null;
  }
};

// Delete a discussion
export const deleteDiscussion = async (postId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting discussion:', error);
    return false;
  }
};

// Fetch all events
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      organizer: event.organizer,
      imageUrl: event.image_url,
      attendees: event.attendees || 0,
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Create a new event
export const createEvent = async (eventData: Partial<Event>): Promise<Event | null> => {
  try {
    if (!eventData.title || !eventData.description || !eventData.location || !eventData.date || !eventData.organizer) {
      throw new Error('Title, description, location, date, and organizer are required');
    }
    
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        date: eventData.date,
        organizer: eventData.organizer,
        image_url: eventData.imageUrl || null,
        attendees: eventData.attendees || 0,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      location: data.location,
      date: data.date,
      organizer: data.organizer,
      imageUrl: data.image_url,
      attendees: data.attendees || 0,
    };
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
};

// Delete an event
export const deleteEvent = async (eventId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
};
