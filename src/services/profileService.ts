
import { supabase } from '@/integrations/supabase/client';
import { Profile, ProfileQRCode, User, UserRole } from '@/types';

// Fetch profile by user ID
export const fetchProfileById = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      description: data.description || '',
      location: data.location || '',
      speciality: data.speciality || '',
      avatarUrl: data.avatar_url || '',
      rating: data.rating || 0,
      verified: data.verified || false,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Update profile
export const updateProfile = async (profileData: Partial<Profile>): Promise<boolean> => {
  try {
    if (!profileData.id) {
      throw new Error('Profile ID is required');
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profileData.name,
        description: profileData.description,
        location: profileData.location,
        speciality: profileData.speciality,
        avatar_url: profileData.avatarUrl,
      })
      .eq('id', profileData.id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};

// Fetch all farmers
export const fetchAllFarmers = async (): Promise<Profile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'farmer');
    
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map(farmer => ({
      id: farmer.id,
      name: farmer.name,
      email: farmer.email,
      role: farmer.role as UserRole,
      description: farmer.description || '',
      location: farmer.location || '',
      speciality: farmer.speciality || '',
      avatarUrl: farmer.avatar_url || '',
      rating: farmer.rating || 0,
      verified: farmer.verified || false,
      createdAt: farmer.created_at,
    }));
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return [];
  }
};

// Get profile QR code
export const getProfileQRCode = async (userId: string): Promise<ProfileQRCode | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_profile_qr_code', { user_id: userId });
    
    if (error) {
      console.error('RPC error:', error);
      return null;
    }
    
    if (!data || data.length === 0) return null;
    
    return {
      id: data.id,
      profileId: data.profile_id,
      qrData: data.qr_data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error getting profile QR code:', error);
    return null;
  }
};

// Ensure profile has QR code - creates one if it doesn't exist
export const ensureProfileHasQRCode = async (userId: string): Promise<string | null> => {
  try {
    // Check if QR code already exists
    const existingQRCode = await getProfileQRCode(userId);
    
    if (existingQRCode) {
      return existingQRCode.qrData;
    }
    
    // If no QR code exists, generate one
    return await generateProfileQRCode(userId);
  } catch (error) {
    console.error('Error ensuring profile QR code:', error);
    return null;
  }
};

// Generate profile QR code
export const generateProfileQRCode = async (userId: string): Promise<string | null> => {
  try {
    // Generate QR data
    const qrData = JSON.stringify({
      profileId: userId,
      timestamp: new Date().toISOString(),
      viewUrl: `${window.location.origin}/profile/${userId}`,
    });
    
    // Store QR data in database using RPC function
    const { error } = await supabase
      .rpc('upsert_profile_qr_code', { 
        user_id: userId,
        qr_code_data: qrData 
      });
    
    if (error) throw error;
    
    return qrData;
  } catch (error) {
    console.error('Error generating profile QR code:', error);
    return null;
  }
};

// Additional functions for profile management
// ...
