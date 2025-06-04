
import { RateLimiter } from '@/utils/inputSanitization';
import { toast } from '@/hooks/use-toast';
import { SecurityEvent } from '../types';

export class SessionValidationRateLimit {
  private readonly MIN_VALIDATION_INTERVAL = 10 * 1000; // 10 seconds
  private lastValidationTime = 0;

  checkRateLimit(
    userId: string,
    logSecurityEvent: (event: SecurityEvent) => void
  ): { allowed: boolean; shouldCache: boolean } {
    const now = Date.now();

    // Check if we've validated too recently
    if (now - this.lastValidationTime < this.MIN_VALIDATION_INTERVAL) {
      return { allowed: false, shouldCache: true };
    }

    // Rate limiting check
    const rateLimitKey = `session_check_${userId}`;
    const rateLimit = RateLimiter.checkRateLimit(rateLimitKey, 5, 60000); // 5 attempts per minute

    if (!rateLimit.allowed) {
      logSecurityEvent({
        type: 'suspicious_activity',
        timestamp: new Date(),
        details: { reason: 'excessive_session_checks', userId }
      });
      
      toast({
        title: "Security Alert",
        description: "Too many session validation attempts. Please wait before trying again.",
        variant: "destructive",
      });
      
      return { allowed: false, shouldCache: false };
    }

    this.lastValidationTime = now;
    return { allowed: true, shouldCache: false };
  }
}
