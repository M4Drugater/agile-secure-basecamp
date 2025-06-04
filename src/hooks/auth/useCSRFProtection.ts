
import { useState, useEffect } from 'react';
import { SecurityHeaders } from '@/utils/securityHeaders';

export function useCSRFProtection() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const token = SecurityHeaders.generateCSRFToken();
    SecurityHeaders.storeCSRFToken(token);
    setCsrfToken(token);
    
    // Apply security headers
    SecurityHeaders.applySecurityHeaders();
  }, []);

  const regenerateCSRFToken = () => {
    const newToken = SecurityHeaders.generateCSRFToken();
    SecurityHeaders.storeCSRFToken(newToken);
    setCsrfToken(newToken);
    return newToken;
  };

  const clearCSRFToken = () => {
    SecurityHeaders.storeCSRFToken('');
    setCsrfToken(null);
  };

  return {
    csrfToken,
    regenerateCSRFToken,
    clearCSRFToken
  };
}
