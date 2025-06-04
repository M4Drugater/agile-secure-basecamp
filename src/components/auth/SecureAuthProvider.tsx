
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorReportingService } from '@/utils/errorBoundary';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface SecureAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  profile: any;
  hasRole: (role: string) => boolean;
  securityEvents: any[];
  detectSuspiciousActivity: () => any;
  authError: string | null;
  refreshProfile: () => Promise<any>;
}

const SecureAuthContext = createContext<SecureAuthContextType | null>(null);

export function useSecureAuthContext() {
  const context = useContext(SecureAuthContext);
  if (!context) {
    throw new Error('useSecureAuthContext must be used within SecureAuthProvider');
  }
  return context;
}

function AuthErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  useEffect(() => {
    ErrorReportingService.reportError(error, { componentStack: '' }, undefined, window.location.pathname);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Alert className="max-w-md" variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="mt-2">
          <div className="space-y-2">
            <p className="font-semibold">Authentication Error</p>
            <p className="text-sm">Something went wrong with authentication. Please try refreshing the page.</p>
            <button
              onClick={resetErrorBoundary}
              className="mt-2 px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90"
            >
              Try Again
            </button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface SecureAuthProviderProps {
  children: React.ReactNode;
}

export function SecureAuthProvider({ children }: SecureAuthProviderProps) {
  const auth = useSecureAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Wait for initial auth state to stabilize
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state during initialization
  if (!isInitialized || (auth.isLoading && !auth.authError)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show auth error if present
  if (auth.authError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            <div className="space-y-2">
              <p className="font-semibold">Authentication Issue</p>
              <p className="text-sm">{auth.authError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90"
              >
                Reload Page
              </button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={AuthErrorFallback}>
      <SecureAuthContext.Provider value={auth}>
        {children}
      </SecureAuthContext.Provider>
    </ErrorBoundary>
  );
}
