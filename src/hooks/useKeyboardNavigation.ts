
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt+B for back
      if (event.altKey && event.key === 'b') {
        event.preventDefault();
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/dashboard');
        }
      }
      
      // Alt+H for home
      if (event.altKey && event.key === 'h') {
        event.preventDefault();
        navigate('/dashboard');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
}
