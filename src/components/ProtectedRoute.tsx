
import { Navigate } from 'react-router-dom';
import { useSimplifiedAuthContext } from '@/contexts/SimplifiedAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: string;
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useSimplifiedAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireRole && !hasRole(requireRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
