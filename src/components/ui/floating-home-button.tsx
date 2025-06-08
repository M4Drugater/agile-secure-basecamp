
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Home, ArrowUp, Keyboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export function FloatingHomeButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2">
      {/* Home Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-purple-500/20 hover:bg-white/20 hover:shadow-purple-500/40 hover:scale-110 transition-all duration-300 group"
            size="icon"
          >
            <Home className="h-6 w-6 text-white group-hover:text-purple-200 transition-colors" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Home (Alt+H)</p>
        </TooltipContent>
      </Tooltip>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
              size="icon"
            >
              <ArrowUp className="h-5 w-5 text-white group-hover:text-purple-200 transition-colors" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Scroll to top</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Keyboard Shortcuts Help */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={showKeyboardShortcuts}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
            size="icon"
          >
            <Keyboard className="h-4 w-4 text-white group-hover:text-purple-200 transition-colors" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Keyboard shortcuts (Alt+?)</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
