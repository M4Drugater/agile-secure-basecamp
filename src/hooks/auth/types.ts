
export interface SecurityEvent {
  type: 'login_attempt' | 'failed_login' | 'token_refresh' | 'suspicious_activity';
  timestamp: Date;
  details: Record<string, any>;
}

export interface SuspiciousActivityReport {
  isSuspicious: boolean;
  failedLogins: number;
  suspiciousEvents: number;
  recentEvents: number;
}
