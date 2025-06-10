
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Library,
  BookOpen, 
  BarChart3, 
  User, 
  Settings,
  GraduationCap,
  CreditCard,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function UnifiedSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/dashboard',
      description: 'Overview and quick access'
    },
    { 
      icon: MessageSquare, 
      label: 'AI Chat', 
      path: '/chat',
      description: 'Chat with CLIPOGINO'
    },
    { 
      icon: FileText, 
      label: 'Content Generator', 
      path: '/content-generator',
      description: 'Create new content'
    },
    { 
      icon: Library, 
      label: 'Content Library', 
      path: '/content-library',
      description: 'Manage your content'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      path: '/content-analytics',
      description: 'Performance insights'
    },
    { 
      icon: BookOpen, 
      label: 'Knowledge Base', 
      path: '/knowledge-base',
      description: 'Your knowledge resources'
    },
    { 
      icon: GraduationCap, 
      label: 'Learning Paths', 
      path: '/learning',
      description: 'Structured learning'
    },
  ];

  const accountItems = [
    { 
      icon: CreditCard, 
      label: 'Billing', 
      path: '/billing',
      description: 'Subscription and usage'
    },
    { 
      icon: User, 
      label: 'Profile', 
      path: '/profile',
      description: 'Personal settings'
    },
  ];

  // Add admin item for admin users
  if (user && ['admin', 'super_admin'].includes(user.user_metadata?.role)) {
    accountItems.push({ 
      icon: Settings, 
      label: 'Admin Panel', 
      path: '/admin',
      description: 'System administration'
    });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">LAIGENT</h1>
            <p className="text-xs text-sidebar-foreground/60">v2.0 Enhanced</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        {/* Main Navigation */}
        <div className="space-y-1 mb-6">
          <h3 className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide">
            Main
          </h3>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-3 text-left ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-70 truncate">{item.description}</div>
              </div>
              {isActive(item.path) && (
                <div className="w-1 h-4 bg-white/30 rounded-full"></div>
              )}
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Account Section */}
        <div className="space-y-1">
          <h3 className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide">
            Account
          </h3>
          {accountItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-3 text-left ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-70 truncate">{item.description}</div>
              </div>
              {isActive(item.path) && (
                <div className="w-1 h-4 bg-white/30 rounded-full"></div>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60 text-center">
          Enhanced AI Platform
        </div>
      </div>
    </div>
  );
}
