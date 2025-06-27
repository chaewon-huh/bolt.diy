import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '~/lib/supabase/client';
import { useAuthStore } from '~/lib/stores/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-bolt-elements-background-depth-2 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Sign In</h2>
          <button
            onClick={onClose}
            className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(59 130 246)', // blue-500
                  brandAccent: 'rgb(37 99 235)', // blue-600
                  brandButtonText: 'white',
                  defaultButtonBackground: '#2e2e2e',
                  defaultButtonBackgroundHover: '#3e3e3e',
                  defaultButtonBorder: '#3e3e3e',
                  defaultButtonText: 'white',
                  dividerBackground: '#2e2e2e',
                  inputBackground: 'transparent',
                  inputBorder: '#3e3e3e',
                  inputBorderHover: '#4e4e4e',
                  inputBorderFocus: 'rgb(59 130 246)',
                  inputText: 'white',
                  inputLabelText: 'rgb(163 163 163)',
                  inputPlaceholder: 'rgb(115 115 115)',
                  messageText: 'rgb(163 163 163)',
                  messageTextDanger: 'rgb(239 68 68)',
                  anchorTextColor: 'rgb(59 130 246)',
                  anchorTextHoverColor: 'rgb(37 99 235)',
                },
                space: {
                  spaceSmall: '4px',
                  spaceMedium: '8px',
                  spaceLarge: '16px',
                  labelBottomMargin: '8px',
                  anchorBottomMargin: '4px',
                  emailInputSpacing: '4px',
                  socialAuthSpacing: '4px',
                  buttonPadding: '10px 15px',
                  inputPadding: '10px 15px',
                },
                fontSizes: {
                  baseButtonSize: '14px',
                  baseInputSize: '14px',
                  baseLabelSize: '14px',
                },
                fonts: {
                  bodyFontFamily: 'inherit',
                  buttonFontFamily: 'inherit',
                  inputFontFamily: 'inherit',
                  labelFontFamily: 'inherit',
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '6px',
                  buttonBorderRadius: '6px',
                  inputBorderRadius: '6px',
                },
              },
            },
            style: {
              button: {
                fontSize: '14px',
                padding: '10px 15px',
              },
              anchor: {
                fontSize: '14px',
              },
              container: {
                color: 'white',
              },
              label: {
                fontSize: '14px',
              },
              input: {
                fontSize: '14px',
              },
              message: {
                fontSize: '13px',
              },
            },
          }}
          providers={['github', 'google']}
          redirectTo={`${window.location.origin}/auth/callback`}
          onlyThirdPartyProviders
          localization={{
            variables: {
              sign_in: {
                social_provider_text: 'Sign in with {{provider}}',
              },
            },
          }}
        />
      </div>
    </div>
  );
}