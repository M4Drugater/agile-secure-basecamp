
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function UniversalTopNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Try to go back in history, fallback to dashboard
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  // Don't show on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      <Button
        onClick={handleBack}
        variant="outline"
        size="sm"
        className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border border-border/50 hover-lift"
        title="Go back (Alt+B)"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <Button
        onClick={handleHome}
        variant="outline"
        size="sm"
        className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border border-border/50 hover-lift"
        title="Go to dashboard (Alt+H)"
      >
        <Home className="h-4 w-4" />
      </Button>
    </div>
  );
}
