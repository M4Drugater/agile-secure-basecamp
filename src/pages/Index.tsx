
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimplifiedAuthContext } from '@/contexts/SimplifiedAuthContext';
import { AppLayout } from "@/components/layout/AppLayout";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useSimplifiedAuthContext();

  useEffect(() => {
    // If we're on the root path and user is authenticated, redirect to dashboard
    if (user && window.location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return <AppLayout />;
};

export default Index;
