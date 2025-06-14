
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './Landing';

export default function Home() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const profileCompleteness = profile?.profile_completeness || 0;
      if (profileCompleteness < 30) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, profile, navigate]);

  // Show landing page for non-authenticated users
  if (!user) {
    return <Landing />;
  }

  return null; // Will redirect before rendering
}
