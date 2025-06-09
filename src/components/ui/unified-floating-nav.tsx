
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Home, 
  ArrowUp, 
  Keyboard, 
  MessageCircle, 
  BookOpen, 
  FileText, 
  Zap,
  Menu,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UnifiedFloatingNavProps {
  showOnHomePage?: boolean;
  variant?: 'minimal' | 'full' | 'contextual';
}

export function UnifiedFloatingNav({ 
  showOnHomePage = false, 
  variant = 'full' 
}: UnifiedFloatingNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show on dashboard/home unless explicitly requested
  if (!showOnHomePage && (location.pathname === '/' || location.pathname === '/dashboard')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showKeyboardShortcuts = () => {
    toast({
      title: "Keyboard Shortcuts",
      description: "Alt+H: Home | Alt+C: Chat | Alt+G: Generator | Alt+K: Knowledge | Alt+P: Profile | Alt+B: Back | Alt+?: Help",
      duration: 5000,
    });
  };

  const quickActions = [
    {
      icon: MessageCircle,
      label: 'Quick Chat',
      description: 'Chat with CLIPOGINO',
      action: () => navigate('/chat'),
      color: 'from-blue-500 to-blue-600',
      shortcut: 'Alt+C',
    },
    {
      icon: FileText,
      label: 'Generate Content',
      description: 'Create new content',
      action: () => navigate('/content-generator'),
      color: 'from-green-500 to-green-600',
      shortcut: 'Alt+G',
    },
    {
      icon: BookOpen,
      label: 'Knowledge Base',
      description: 'Access knowledge',
      action: () => navigate('/knowledge-base'),
      color: 'from-purple-500 to-purple-600',
      shortcut: 'Alt+K',
    },
  ];

  const handleQuickAction = (action: () => void) => {
    action();
    setIsExpanded(false);
  };

  const baseButtonClasses = "backdrop-blur-sm border border-white/20 shadow-lg hover:scale-110 transition-all duration-300 group";

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      {/* Main Home Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => navigate('/dashboard')}
            className={cn(
              "w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50",
              baseButtonClasses
            )}
            size="icon"
          >
            <Home className="h-7 w-7 drop-shadow-sm" />
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

      {/* Quick Actions Toggle (only in full variant) */}
      {variant === 'full' && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "w-14 h-14 rounded-full transition-all duration-300",
                isExpanded 
                  ? 'bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-500/30' 
                  : 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-gray-500/20',
                baseButtonClasses
              )}
              size="icon"
            >
              {isExpanded ? (
                <X className="h-6 w-6 text-white transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-200 transition-transform duration-300" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
            <p className="font-medium">Quick Actions</p>
            <p className="text-xs opacity-80">Show/hide quick navigation</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Quick Actions Menu */}
      {variant === 'full' && isExpanded && (
        <div className="flex flex-col gap-2 animate-in slide-in-from-left-2 duration-300">
          {quickActions.map((action, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleQuickAction(action.action)}
                  className={cn(
                    "w-12 h-12 rounded-full bg-gradient-to-br",
                    action.color,
                    baseButtonClasses
                  )}
                  size="icon"
                >
                  <action.icon className="h-5 w-5 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                <p className="font-medium">{action.label} ({action.shortcut})</p>
                <p className="text-xs opacity-80">{action.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}

      {/* Scroll to Top (contextual) */}
      {showScrollTop && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={scrollToTop}
              className={cn(
                "w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/20 hover:shadow-emerald-500/40",
                baseButtonClasses
              )}
              size="icon"
            >
              <ArrowUp className="h-5 w-5 text-white drop-shadow-sm" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
            <p className="font-medium">Scroll to top</p>
            <p className="text-xs opacity-80">Return to page top</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Keyboard Shortcuts Help (minimal in all variants) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={showKeyboardShortcuts}
            className={cn(
              "w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/20 hover:shadow-indigo-500/40",
              baseButtonClasses
            )}
            size="icon"
          >
            <Keyboard className="h-4 w-4 text-white drop-shadow-sm" />
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
