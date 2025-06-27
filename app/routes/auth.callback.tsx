import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { supabase } from '~/lib/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error('Error during auth callback:', error);
          navigate('/?error=auth_callback_error');
          return;
        }

        // Get the user's session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Check if user has a profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!profile) {
            // Create a profile if it doesn't exist
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                username: session.user.email?.split('@')[0] || 'user',
              });

            if (profileError) {
              console.error('Error creating profile:', profileError);
            }
          }

          // Redirect to home page
          navigate('/');
        } else {
          navigate('/?error=no_session');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        navigate('/?error=unexpected_error');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bolt-elements-background-depth-1 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-bolt-elements-textPrimary"></div>
        <p className="mt-4 text-bolt-elements-textSecondary">Completing sign in...</p>
      </div>
    </div>
  );
}