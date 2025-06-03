
import { supabase } from '@/integrations/supabase/client';
import { SecurityHeaders } from './securityHeaders';
import { RateLimiter } from './inputSanitization';

interface SecureRequestOptions extends RequestInit {
  requireAuth?: boolean;
  rateLimitKey?: string;
  maxRetries?: number;
  timeout?: number;
}

export class SecureApiClient {
  private static defaultTimeout = 30000; // 30 seconds
  private static maxRetries = 3;

  /**
   * Make a secure API request with built-in protections
   */
  static async secureRequest(
    url: string, 
    options: SecureRequestOptions = {}
  ): Promise<Response> {
    const {
      requireAuth = true,
      rateLimitKey,
      maxRetries = this.maxRetries,
      timeout = this.defaultTimeout,
      ...requestOptions
    } = options;

    // Rate limiting check
    if (rateLimitKey) {
      const rateLimit = RateLimiter.checkRateLimit(rateLimitKey, 10, 60000); // 10 requests per minute
      if (!rateLimit.allowed) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    }

    // Authentication check
    if (requireAuth) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      // Add auth header
      requestOptions.headers = {
        ...requestOptions.headers,
        'Authorization': `Bearer ${session.access_token}`,
      };
    }

    // Add CSRF protection for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(requestOptions.method?.toUpperCase() || 'GET')) {
      const csrfToken = SecurityHeaders.getCSRFToken();
      if (csrfToken) {
        requestOptions.headers = {
          ...requestOptions.headers,
          'X-CSRF-Token': csrfToken,
        };
      }
    }

    // Add security headers
    requestOptions.headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...requestOptions.headers,
    };

    // Request with timeout and retries
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Check for suspicious responses
        if (response.status === 429) {
          throw new Error('Rate limit exceeded by server');
        }

        if (response.status >= 500 && attempt < maxRetries) {
          throw new Error(`Server error: ${response.status}`);
        }

        return response;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout');
        }

        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Secure POST request
   */
  static async post(url: string, data: any, options: SecureRequestOptions = {}): Promise<Response> {
    return this.secureRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Secure GET request
   */
  static async get(url: string, options: SecureRequestOptions = {}): Promise<Response> {
    return this.secureRequest(url, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * Secure PUT request
   */
  static async put(url: string, data: any, options: SecureRequestOptions = {}): Promise<Response> {
    return this.secureRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Secure DELETE request
   */
  static async delete(url: string, options: SecureRequestOptions = {}): Promise<Response> {
    return this.secureRequest(url, {
      method: 'DELETE',
      ...options,
    });
  }
}
