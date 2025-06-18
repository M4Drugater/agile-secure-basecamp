
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type Language = 'en' | 'es' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const { user, profile } = useAuth();
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language from user profile or browser
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        let initialLanguage: Language = 'en';

        // If user is logged in and has a preferred language in profile
        if (user && profile?.preferred_language) {
          initialLanguage = profile.preferred_language as Language;
        } else {
          // Try to get from localStorage or detect from browser
          const savedLanguage = localStorage.getItem('language') as Language;
          if (savedLanguage && ['en', 'es', 'it'].includes(savedLanguage)) {
            initialLanguage = savedLanguage;
          } else {
            // Detect from browser
            const browserLanguage = navigator.language.split('-')[0] as Language;
            if (['en', 'es', 'it'].includes(browserLanguage)) {
              initialLanguage = browserLanguage;
            }
          }
        }

        setLanguageState(initialLanguage);
        await i18n.changeLanguage(initialLanguage);
      } catch (error) {
        console.error('Error initializing language:', error);
        setLanguageState('en');
        await i18n.changeLanguage('en');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, [user, profile, i18n]);

  const setLanguage = async (newLanguage: Language) => {
    try {
      setLanguageState(newLanguage);
      await i18n.changeLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);

      // If user is logged in, update their profile
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ preferred_language: newLanguage })
          .eq('id', user.id);
        
        if (error) {
          console.error('Error updating user language preference:', error);
        }
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const value = {
    language,
    setLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
