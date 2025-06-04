
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, User, BookOpen, FileText, Library, Settings, BarChart3, GraduationCap, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function AppNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'AI Chat', path: '/chat' },
    { icon: FileText, label: 'Content Generator', path: '/content-generator' },
    { icon: Library, label: 'Content Library', path: '/content-library' },
    { icon: BarChart3, label: 'Content Analytics', path: '/content-analytics' },
    { icon: BookOpen, label: 'Knowledge Base', path: '/knowledge-base' },
    { icon: GraduationCap, label: 'Learning Paths', path: '/learning' },
    { icon: Building2, label: 'Organization', path: '/organization' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  // Add admin link for admin users
  if (user && ['admin', 'super_admin'].includes(user.user_metadata?.role)) {
    navigationItems.push({ icon: Settings, label: 'Admin', path: '/admin' });
  }

  return (
    <nav className="flex flex-col space-y-1">
      {navigationItems.map(({ icon: Icon, label, path }) => {
        const isActive = location.pathname === path;
        return (
          <Button
            key={path}
            variant={isActive ? 'default' : 'ghost'}
            className={`w-full justify-start group transition-all duration-200 ${
              isActive 
                ? 'bg-gradient-primary text-white shadow-medium hover:shadow-strong' 
                : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover-lift'
            }`}
            onClick={() => navigate(path)}
          >
            <Icon className={`h-4 w-4 mr-3 transition-transform duration-200 ${
              isActive ? 'scale-110' : 'group-hover:scale-105'
            }`} />
            <span className="font-medium">{label}</span>
            {isActive && (
              <div className="ml-auto w-1 h-4 bg-white/30 rounded-full"></div>
            )}
          </Button>
        );
      })}
    </nav>
  );
}
