
import { useState } from 'react';
import { SecurityEvent, SuspiciousActivityReport } from './types';

export function useSecurityEvents() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);

  const logSecurityEvent = (event: SecurityEvent) => {
    setSecurityEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events
    
    // Log critical events
    if (['failed_login', 'suspicious_activity'].includes(event.type)) {
      console.warn('Security Event:', event);
    }
  };

  const detectSuspiciousActivity = (): SuspiciousActivityReport => {
    const recentEvents = securityEvents.filter(
      event => Date.now() - event.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    const failedLogins = recentEvents.filter(event => event.type === 'failed_login').length;
    const suspiciousEvents = recentEvents.filter(event => event.type === 'suspicious_activity').length;

    return {
      isSuspicious: failedLogins > 3 || suspiciousEvents > 1,
      failedLogins,
      suspiciousEvents,
      recentEvents: recentEvents.length
    };
  };

  const clearSecurityEvents = () => {
    setSecurityEvents([]);
  };

  return {
    securityEvents,
    logSecurityEvent,
    detectSuspiciousActivity,
    clearSecurityEvents
  };
}
