import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MessageCircle, 
  FileText, 
  BookOpen, 
  BarChart3, 
  User, 
  Settings,
  Bell,
  Search,
  Zap
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useContextBuilder } from '@/hooks/context/useContextBuilder';
import { toast } from '@/hooks/use-toast';

export function EnhancedTopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { getContextSummary } = useContextBuilder();
  
  const contextSummary = getContextSummary();

  const navigationItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/dashboard',
      shortcut: 'Alt+H',
    },
    {
      icon: MessageCircle,
      label: 'AI Chat',
      path: '/chat',
      shortcut: 'Alt+C',
      badge: contextSummary.conversationCount > 0 ? 'Active' : null,
      badgeVariant: 'default' as const,
    },
    {
      icon: FileText,
      label: 'Content',
      path: '/content-generator',
      shortcut: 'Alt+G',
      badge: contextSummary.contentCount > 0 ? contextSummary.contentCount.toString() : null,
      badgeVariant: 'secondary' as const,
    },
    {
      icon: BookOpen,
      label: 'Knowledge',
      path: '/knowledge-base',
      shortcut: 'Alt+K',
      badge: contextSummary.knowledgeCount > 0 ? contextSummary.knowledgeCount.toString() : null,
      badgeVariant: 'outline' as const,
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/content-analytics',
      shortcut: 'Alt+A',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string, label: string) => {
    navigate(path);
    toast({
      title: "Navigation",
      description: `Navigated to ${label}`,
    });
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                LAIGENT
              </h1>
              <p className="text-xs text-muted-foreground">v2.0 Enhanced</p>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const active = isActive(item.path);
              return (
                <div key={item.path} className="relative">
                  <Button
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleNavigation(item.path, item.label)}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                      ${active 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40' 
                        : 'hover:bg-primary/10 hover:text-primary'
                      }
                    `}
                    title={`${item.label} (${item.shortcut})`}
                  >
                    <item.icon className={`h-4 w-4 ${active ? 'text-white' : ''}`} />
                    <span className="hidden md:inline-block font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badgeVariant} 
                        className="ml-1 px-1.5 py-0.5 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Context Status Indicator */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-muted/50 rounded-full">
              <div className={`w-2 h-2 rounded-full ${contextSummary.hasProfile ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-xs font-medium">
                Context: {contextSummary.hasProfile ? 'Rich' : 'Basic'}
              </span>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {contextSummary.activityCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </Button>

            {/* Profile */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline-block">{user?.email?.split('@')[0]}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
