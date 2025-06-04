
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SecurityEvent } from '../types';

interface SessionExpirationConfig {
  minimumActiveTime: number;
  warningThreshold: number;
  maxActiveTime: number;
}

export class SessionExpirationHandler {
  private config: SessionExpirationConfig = {
    minimumActiveTime: 10 * 60 * 1000, // 10 minutes
    warningThreshold: 15 * 60 * 1000, // 15 minutes
    maxActiveTime: 12 * 60 * 60 * 1000, // 12 hours
  };

  async handleSessionExpiration(
    session: any,
    sessionStartTime: number | null,
    logSecurityEvent: (event: SecurityEvent) => void
  ): Promise<void> {
    const sessionExpiresAt = session.expires_at;
    if (!sessionExpiresAt) return;

    const expirationTime = sessionExpiresAt * 1000;
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;
    const sessionActiveTime = sessionStartTime ? currentTime - sessionStartTime : 0;

    // Show warnings when appropriate
    const shouldShowWarning = this.shouldShowExpirationWarning(timeUntilExpiry, sessionActiveTime);
    
    if (shouldShowWarning) {
      this.handleExpirationWarning(timeUntilExpiry, sessionActiveTime, logSecurityEvent);
    }

    // Auto-refresh token if needed
    await this.handleTokenRefresh(timeUntilExpiry, sessionActiveTime, logSecurityEvent);
  }

  private shouldShowExpirationWarning(timeUntilExpiry: number, sessionActiveTime: number): boolean {
    return (
      (timeUntilExpiry < this.config.warningThreshold && sessionActiveTime > this.config.minimumActiveTime) ||
      (sessionActiveTime > this.config.maxActiveTime && timeUntilExpiry > 60 * 60 * 1000)
    );
  }

  private handleExpirationWarning(
    timeUntilExpiry: number,
    sessionActiveTime: number,
    logSecurityEvent: (event: SecurityEvent) => void
  ): void {
    const warningType = timeUntilExpiry < this.config.warningThreshold ? 'session_near_expiry' : 'session_too_long';
    
    logSecurityEvent({
      type: 'suspicious_activity',
      timestamp: new Date(),
      details: { 
        reason: warningType, 
        timeUntilExpiry, 
        sessionActiveTime
      }
    });

    const message = warningType === 'session_near_expiry' 
      ? `Your session will expire in ${Math.round(timeUntilExpiry / (60 * 1000))} minutes. Please save your work.`
      : "Your session has been active for a long time. Consider signing out and back in for security.";

    toast({
      title: "Session Warning",
      description: message,
      variant: "destructive",
    });
  }

  private async handleTokenRefresh(
    timeUntilExpiry: number,
    sessionActiveTime: number,
    logSecurityEvent: (event: SecurityEvent) => void
  ): Promise<void> {
    // Auto-refresh token if expiring within 30 minutes and session is active
    if (timeUntilExpiry < 30 * 60 * 1000 && sessionActiveTime > this.config.minimumActiveTime) {
      try {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (!refreshError) {
          logSecurityEvent({
            type: 'token_refresh',
            timestamp: new Date(),
            details: { reason: 'auto_refresh', timeUntilExpiry }
          });
        }
      } catch (refreshError) {
        console.warn('Failed to refresh session:', refreshError);
      }
    }
  }
}
