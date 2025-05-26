
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function FloatingHomeButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on dashboard/home page or auth page
  if (location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/auth') return null;

  return (
    <Button
      onClick={() => navigate('/dashboard')}
      className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
      size="icon"
      variant="outline"
    >
      <Home className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
    </Button>
  );
}
