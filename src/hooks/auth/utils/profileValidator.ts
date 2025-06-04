
import { toast } from '@/hooks/use-toast';
import { SecurityEvent } from '../types';

export class ProfileValidator {
  validateProfile(
    profile: any,
    user: any,
    logSecurityEvent: (event: SecurityEvent) => void
  ): { isValid: boolean; shouldSignOut: boolean } {
    if (profile && profile.is_active === false) {
      logSecurityEvent({
        type: 'failed_login',
        timestamp: new Date(),
        details: { reason: 'account_deactivated', userId: user.id }
      });

      toast({
        title: "Account deactivated",
        description: "Your account has been deactivated. Please contact support.",
        variant: "destructive",
      });
      
      return { isValid: false, shouldSignOut: true };
    }

    return { isValid: true, shouldSignOut: false };
  }
}
