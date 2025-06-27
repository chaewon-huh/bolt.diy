import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { useAuthStore } from '~/lib/stores/auth';
import { profileStore } from '~/lib/stores/profile';
import { AuthModal } from '~/components/auth/AuthModal';

export function AuthButton() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, signOut } = useAuthStore();
  const profile = useStore(profileStore);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bolt-elements-background-depth-2">
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt={profile.username || 'User'}
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="text-sm text-bolt-elements-textPrimary">
            {profile.username || user.email?.split('@')[0] || 'User'}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 text-sm rounded-lg bg-bolt-elements-button-secondary-background hover:bg-bolt-elements-button-secondary-backgroundHover text-bolt-elements-button-secondary-text transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="px-4 py-1.5 text-sm rounded-lg bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text transition-colors"
      >
        Sign In
      </button>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}