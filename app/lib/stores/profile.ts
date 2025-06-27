import { atom } from 'nanostores';
import { supabase } from '~/lib/supabase/client';

interface Profile {
  username: string;
  bio: string;
  avatar: string;
}

// Initialize with stored profile or defaults
const storedProfile = typeof window !== 'undefined' ? localStorage.getItem('bolt_profile') : null;
const initialProfile: Profile = storedProfile
  ? JSON.parse(storedProfile)
  : {
      username: '',
      bio: '',
      avatar: '',
    };

export const profileStore = atom<Profile>(initialProfile);

export const updateProfile = async (updates: Partial<Profile>) => {
  const newProfile = { ...profileStore.get(), ...updates };
  profileStore.set(newProfile);

  // Persist to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('bolt_profile', JSON.stringify(newProfile));
  }

  // Also update in Supabase if user is authenticated
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: newProfile.username,
          bio: newProfile.bio,
          avatar_url: newProfile.avatar,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile in database:', error);
      }
    }
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

// Function to sync profile from database
export const syncProfileFromDatabase = async (userId: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, bio, avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile from database:', error);
      return;
    }

    if (profile) {
      const mappedProfile: Profile = {
        username: profile.username || '',
        bio: profile.bio || '',
        avatar: profile.avatar_url || '',
      };
      
      profileStore.set(mappedProfile);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('bolt_profile', JSON.stringify(mappedProfile));
      }
    }
  } catch (error) {
    console.error('Error syncing profile:', error);
  }
};
