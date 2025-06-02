
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
}

export function useErrorBoundary() {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);

  const captureError = useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
    const errorData: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: Date.now(),
    };

    setErrors(prev => [...prev, errorData]);

    // Log to console for development
    console.error('Error captured:', errorData);

    // Show user-friendly error message
    toast({
      title: "Something went wrong",
      description: "An unexpected error occurred. Please try again or contact support if the problem persists.",
      variant: "destructive",
    });

    // In a real app, you might want to send this to an error reporting service
    // reportErrorToService(errorData);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getLastError = useCallback(() => {
    return errors[errors.length - 1] || null;
  }, [errors]);

  return {
    errors,
    captureError,
    clearErrors,
    getLastError,
    hasErrors: errors.length > 0,
  };
}
