
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Home, ArrowUp, Keyboard, MessageCircle, BookOpen, FileText, Settings, Zap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function EnhancedFloatingButtons() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Handle scroll to top functionality - ALWAYS call this hook
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show on dashboard/home page - moved AFTER all hooks
  if (location.pathname === '/' || location.pathname === '/dashboard') return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showKeyboardShortcuts = () => {
    toast({
      title: "Keyboard Shortcuts",
      description: "Alt+H: Home | Alt+C: Chat | Alt+G: Generator | Alt+K: Knowledge | Alt+P: Profile | Alt+B: Back | Alt+?: Help",
    });
  };

  const quickActions = [
    {
      icon: MessageCircle,
      label: 'Quick Chat',
      description: 'Chat with CLIPOGINO',
      action: () => navigate('/chat'),
      variant: 'default' as const,
    },
    {
      icon: FileText,
      label: 'Generate Content',
      description: 'Create new content',
      action: () => navigate('/content-generator'),
      variant: 'secondary' as const,
    },
    {
      icon: BookOpen,
      label: 'Knowledge Base',
      description: 'Access knowledge',
      action: () => navigate('/knowledge-base'),
      variant: 'outline' as const,
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      {/* Enhanced Home Button with better contrast */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-2 border-white/30 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 group backdrop-blur-sm"
            size="icon"
          >
            <Home className="h-7 w-7 text-white group-hover:text-purple-100 transition-colors drop-shadow-sm" />
            <div className="absolute -top-1 -right-1">
              <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
          <p className="font-medium">Home (Alt+H)</p>
          <p className="text-xs opacity-80">Return to dashboard</p>
        </TooltipContent>
      </Tooltip>

      {/* Quick Actions Toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className={`w-14 h-14 rounded-full transition-all duration-300 group backdrop-blur-sm shadow-lg ${
              showQuickActions 
                ? 'bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-2 border-white/30 shadow-orange-500/30' 
                : 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 border-2 border-white/20 shadow-gray-500/20'
            } hover:scale-110`}
            size="icon"
          >
            <Zap className={`h-6 w-6 transition-all duration-300 ${showQuickActions ? 'text-white rotate-180' : 'text-gray-200'} group-hover:text-white drop-shadow-sm`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
          <p className="font-medium">Quick Actions</p>
          <p className="text-xs opacity-80">Show/hide quick actions</p>
        </TooltipContent>
      </Tooltip>

      {/* Quick Actions Menu */}
      {showQuickActions && (
        <div className="flex flex-col gap-2 animate-in slide-in-from-left-2 duration-300">
          {quickActions.map((action, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    action.action();
                    setShowQuickActions(false);
                  }}
                  variant={action.variant}
                  className="w-12 h-12 rounded-full backdrop-blur-sm border-2 border-white/20 shadow-lg hover:scale-110 transition-all duration-300 group"
                  size="icon"
                >
                  <action.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                <p className="font-medium">{action.label}</p>
                <p className="text-xs opacity-80">{action.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}

      {/* Enhanced Scroll to Top Button */}
      {showScrollTop && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border-2 border-white/30 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-110 transition-all duration-300 group backdrop-blur-sm"
              size="icon"
            >
              <ArrowUp className="h-5 w-5 text-white group-hover:text-emerald-100 transition-colors drop-shadow-sm" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
            <p className="font-medium">Scroll to top</p>
            <p className="text-xs opacity-80">Return to page top</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Enhanced Keyboard Shortcuts Help */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={showKeyboardShortcuts}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-2 border-white/20 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-110 transition-all duration-300 group backdrop-blur-sm"
            size="icon"
          >
            <Keyboard className="h-4 w-4 text-white group-hover:text-indigo-100 transition-colors drop-shadow-sm" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
          <p className="font-medium">Keyboard shortcuts (Alt+?)</p>
          <p className="text-xs opacity-80">View all shortcuts</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
