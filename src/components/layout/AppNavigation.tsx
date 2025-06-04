
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, User, BookOpen, FileText, Library, Settings, BarChart3, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function AppNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'AI Chat', path: '/chat' },
    { icon: FileText, label: 'Content Generator', path: '/content-generator' },
    { icon: Library, label: 'Content Library', path: '/content-library' },
    { icon: BarChart3, label: 'Content Analytics', path: '/content-analytics' },
    { icon: BookOpen, label: 'Knowledge Base', path: '/knowledge-base' },
    { icon: GraduationCap, label: 'Learning Paths', path: '/learning' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  // Add admin link for admin users
  if (user && ['admin', 'super_admin'].includes(user.user_metadata?.role)) {
    navigationItems.push({ icon: Settings, label: 'Admin', path: '/admin' });
  }

  return (
    <nav className="flex flex-col space-y-2">
      {navigationItems.map(({ icon: Icon, label, path }) => (
        <Button
          key={path}
          variant={location.pathname === path ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => navigate(path)}
        >
          <Icon className="h-4 w-4 mr-2" />
          {label}
        </Button>
      ))}
    </nav>
  );
}
