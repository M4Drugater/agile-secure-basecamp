
import DOMPurify from 'dompurify';

export interface SanitizationOptions {
  allowHtml?: boolean;
  maxLength?: number;
  stripWhitespace?: boolean;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

export class InputSanitizer {
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  static sanitizeHtml(input: string, options: SanitizationOptions = {}): string {
    if (!input) return '';

    const config: any = {
      ALLOWED_TAGS: options.allowedTags || ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: options.allowedAttributes || ['href', 'title'],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
    };

    // DOMPurify returns TrustedHTML, convert to string through 'unknown'
    const sanitizedHtml = DOMPurify.sanitize(input, config);
    let sanitized = String(sanitizedHtml as unknown);

    if (options.maxLength && sanitized.length > options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }

    if (options.stripWhitespace) {
      sanitized = sanitized.trim();
    }

    return sanitized;
  }

  /**
   * Sanitize plain text input
   */
  static sanitizeText(input: string, options: SanitizationOptions = {}): string {
    if (!input) return '';

    // Remove any HTML tags
    let sanitized = input.replace(/<[^>]*>/g, '');
    
    // Escape special characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    if (options.maxLength && sanitized.length > options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }

    if (options.stripWhitespace) {
      sanitized = sanitized.trim();
    }

    return sanitized;
  }

  /**
   * Sanitize email input
   */
  static sanitizeEmail(email: string): string {
    if (!email) return '';
    
    return email
      .toLowerCase()
      .trim()
      .replace(/[^\w@.-]/g, ''); // Allow only word chars, @, ., and -
  }

  /**
   * Sanitize SQL-like input to prevent injection
   */
  static sanitizeSqlInput(input: string): string {
    if (!input) return '';

    // Remove potential SQL injection patterns
    const sqlPatterns = [
      /(\s|^)(select|insert|update|delete|drop|create|alter|exec|execute|union|script|javascript|vbscript)(\s|$)/gi,
      /['"`;\\]/g,
      /--/g,
      /\/\*/g,
      /\*\//g
    ];

    let sanitized = input;
    sqlPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    return sanitized.trim();
  }

  /**
   * Validate and sanitize file names
   */
  static sanitizeFileName(fileName: string): string {
    if (!fileName) return '';

    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, '') // Allow only alphanumeric, dots, underscores, hyphens
      .replace(/\.+/g, '.') // Replace multiple dots with single dot
      .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
      .substring(0, 255); // Limit length
  }

  /**
   * Sanitize URL input
   */
  static sanitizeUrl(url: string): string {
    if (!url) return '';

    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return '';
      }
      return urlObj.toString();
    } catch {
      return '';
    }
  }
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private static attempts: Map<string, { count: number; timestamp: number }> = new Map();

  static checkRateLimit(
    identifier: string, 
    maxAttempts: number = 5, 
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): { allowed: boolean; remainingAttempts: number; resetTime?: number } {
    const now = Date.now();
    const key = identifier;
    const attempt = this.attempts.get(key);

    if (!attempt || now - attempt.timestamp > windowMs) {
      // Reset or first attempt
      this.attempts.set(key, { count: 1, timestamp: now });
      return { allowed: true, remainingAttempts: maxAttempts - 1 };
    }

    if (attempt.count >= maxAttempts) {
      return { 
        allowed: false, 
        remainingAttempts: 0,
        resetTime: attempt.timestamp + windowMs
      };
    }

    // Increment attempt count
    attempt.count += 1;
    this.attempts.set(key, attempt);

    return { 
      allowed: true, 
      remainingAttempts: maxAttempts - attempt.count 
    };
  }

  static resetRateLimit(identifier: string): void {
    this.attempts.delete(identifier);
  }
}
