
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export function useKeyboardNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if no input elements are focused
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      // Alt+B for back
      if (event.altKey && event.key === 'b') {
        event.preventDefault();
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/dashboard');
        }
        toast({
          title: "Navigation",
          description: "Navigated back",
        });
      }
      
      // Alt+H for home
      if (event.altKey && event.key === 'h') {
        event.preventDefault();
        navigate('/dashboard');
        toast({
          title: "Navigation", 
          description: "Navigated to dashboard",
        });
      }

      // Alt+C for chat
      if (event.altKey && event.key === 'c') {
        event.preventDefault();
        navigate('/chat');
        toast({
          title: "Navigation",
          description: "Navigated to AI chat",
        });
      }

      // Alt+G for content generator
      if (event.altKey && event.key === 'g') {
        event.preventDefault();
        navigate('/content-generator');
        toast({
          title: "Navigation",
          description: "Navigated to content generator",
        });
      }

      // Alt+K for knowledge base
      if (event.altKey && event.key === 'k') {
        event.preventDefault();
        navigate('/knowledge-base');
        toast({
          title: "Navigation",
          description: "Navigated to knowledge base",
        });
      }

      // Alt+P for profile
      if (event.altKey && event.key === 'p') {
        event.preventDefault();
        navigate('/profile');
        toast({
          title: "Navigation",
          description: "Navigated to profile",
        });
      }

      // Alt+A for admin (if applicable)
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        navigate('/admin');
        toast({
          title: "Navigation",
          description: "Navigated to admin panel",
        });
      }

      // Show keyboard shortcuts help with Alt+?
      if (event.altKey && event.key === '?') {
        event.preventDefault();
        toast({
          title: "Keyboard Shortcuts",
          description: "Alt+H: Home | Alt+C: Chat | Alt+G: Generator | Alt+K: Knowledge | Alt+P: Profile | Alt+A: Admin | Alt+B: Back",
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, location]);
}
