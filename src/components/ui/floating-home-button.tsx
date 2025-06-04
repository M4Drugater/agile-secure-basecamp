
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function FloatingHomeButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on dashboard/home page
  if (location.pathname === '/' || location.pathname === '/dashboard') return null;

  return (
    <Button
      onClick={() => navigate('/dashboard')}
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-purple-500/20 hover:bg-white/20 hover:shadow-purple-500/40 hover:scale-110 transition-all duration-300 group"
      size="icon"
    >
      <Home className="h-6 w-6 text-white group-hover:text-purple-200 transition-colors" />
    </Button>
  );
}
