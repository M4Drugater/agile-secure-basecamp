import { ErrorInfo } from 'react';

export interface ErrorReport {
  error: Error;
  errorInfo: ErrorInfo;
  timestamp: Date;
  userId?: string;
  route?: string;
  userAgent: string;
}

export class ErrorReportingService {
  private static errorQueue: ErrorReport[] = [];
  private static maxQueueSize = 50;

  static reportError(error: Error, errorInfo: ErrorInfo, userId?: string, route?: string) {
    const errorReport: ErrorReport = {
      error,
      errorInfo,
      timestamp: new Date(),
      userId,
      route,
      userAgent: navigator.userAgent
    };

    // Add to queue
    this.errorQueue.push(errorReport);
    
    // Keep queue size manageable
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Full Report:', errorReport);
    }

    // TODO: Send to monitoring service in production
    // this.sendToMonitoringService(errorReport);
  }

  static getErrorQueue(): ErrorReport[] {
    return [...this.errorQueue];
  }

  static clearErrorQueue(): void {
    this.errorQueue = [];
  }

  private static async sendToMonitoringService(errorReport: ErrorReport): Promise<void> {
    // Implementation for sending to external monitoring service
    // This could be Sentry, LogRocket, or custom endpoint
    try {
      // Example implementation:
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });
    } catch (err) {
      console.warn('Failed to send error report to monitoring service:', err);
    }
  }
}
