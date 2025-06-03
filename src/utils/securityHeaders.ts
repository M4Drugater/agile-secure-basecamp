
/**
 * Security headers utility for client-side protection
 */
export class SecurityHeaders {
  /**
   * Content Security Policy configuration
   */
  static generateCSP(): string {
    const directives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.openai.com https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://jzvpgqtobzqbavsillqp.supabase.co https://api.openai.com wss://jzvpgqtobzqbavsillqp.supabase.co",
      "media-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ];
    
    return directives.join('; ');
  }

  /**
   * Apply security headers via meta tags (client-side)
   */
  static applySecurityHeaders(): void {
    // Content Security Policy
    this.setMetaTag('Content-Security-Policy', this.generateCSP());
    
    // X-Frame-Options
    this.setMetaTag('X-Frame-Options', 'DENY');
    
    // X-Content-Type-Options
    this.setMetaTag('X-Content-Type-Options', 'nosniff');
    
    // Referrer Policy
    this.setMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy
    this.setMetaTag('Permissions-Policy', 
      'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  }

  private static setMetaTag(name: string, content: string): void {
    // Remove existing meta tag if present
    const existing = document.querySelector(`meta[http-equiv="${name}"]`);
    if (existing) {
      existing.remove();
    }

    // Create new meta tag
    const meta = document.createElement('meta');
    meta.httpEquiv = name;
    meta.content = content;
    document.head.appendChild(meta);
  }

  /**
   * Generate nonce for inline scripts
   */
  static generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  /**
   * Validate origin for CSRF protection
   */
  static validateOrigin(origin: string, allowedOrigins: string[]): boolean {
    return allowedOrigins.includes(origin);
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Store CSRF token securely
   */
  static storeCSRFToken(token: string): void {
    sessionStorage.setItem('csrf_token', token);
  }

  /**
   * Retrieve CSRF token
   */
  static getCSRFToken(): string | null {
    return sessionStorage.getItem('csrf_token');
  }

  /**
   * Validate CSRF token
   */
  static validateCSRFToken(token: string): boolean {
    const storedToken = this.getCSRFToken();
    return storedToken === token && token.length === 64; // 32 bytes = 64 hex chars
  }
}
