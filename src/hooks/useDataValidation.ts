
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { InputSanitizer } from '@/utils/inputSanitization';

interface ValidationRule {
  field: string;
  validator: (value: any) => boolean;
  message: string;
  sanitizer?: (value: any) => any;
}

interface SecurityValidationOptions {
  enableSanitization?: boolean;
  maxFieldLength?: number;
  allowHtml?: boolean;
}

export function useDataValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  // Enhanced email validation with additional security checks
  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    
    // Basic format validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) return false;
    
    // Additional security checks
    if (email.length > 254) return false; // RFC 5321 limit
    if (email.includes('..')) return false; // Consecutive dots
    if (email.startsWith('.') || email.endsWith('.')) return false;
    
    return true;
  };

  const validateRequired = (value: any): boolean => {
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
  };

  const validateMinLength = (value: string, minLength: number): boolean => {
    return value && value.length >= minLength;
  };

  const validateMaxLength = (value: string, maxLength: number): boolean => {
    return !value || value.length <= maxLength;
  };

  const validateNumericRange = (value: number, min: number, max: number): boolean => {
    return !isNaN(value) && value >= min && value <= max;
  };

  // Enhanced password validation
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common patterns
    const commonPatterns = [
      /(.)\1{2,}/, // Three or more repeated characters
      /123456|abcdef|qwerty|password/i, // Common sequences
    ];

    if (commonPatterns.some(pattern => pattern.test(password))) {
      errors.push('Password contains common patterns and is not secure');
    }

    return { isValid: errors.length === 0, errors };
  };

  // Content Security Policy validation
  const validateContent = (content: string, options: SecurityValidationOptions = {}): boolean => {
    if (!content) return true;

    const maxLength = options.maxFieldLength || 10000;
    if (content.length > maxLength) return false;

    // Check for potentially malicious content
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi,
      /onclick\s*=/gi,
    ];

    return !maliciousPatterns.some(pattern => pattern.test(content));
  };

  const sanitizeAndValidate = useCallback(async (
    data: Record<string, any>, 
    rules: ValidationRule[],
    options: SecurityValidationOptions = {}
  ) => {
    setIsValidating(true);
    const newErrors: Record<string, string> = {};
    const sanitizedData: Record<string, any> = {};

    for (const rule of rules) {
      let value = data[rule.field];

      // Apply sanitization if enabled and sanitizer is provided
      if (options.enableSanitization && rule.sanitizer) {
        value = rule.sanitizer(value);
        sanitizedData[rule.field] = value;
      } else if (options.enableSanitization && typeof value === 'string') {
        // Default sanitization for strings
        value = options.allowHtml 
          ? InputSanitizer.sanitizeHtml(value)
          : InputSanitizer.sanitizeText(value);
        sanitizedData[rule.field] = value;
      } else {
        sanitizedData[rule.field] = value;
      }

      // Validate the sanitized value
      if (!rule.validator(value)) {
        newErrors[rule.field] = rule.message;
      }
    }

    setErrors(newErrors);
    setIsValidating(false);

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors and try again.",
        variant: "destructive",
      });
      return { isValid: false, sanitizedData };
    }

    return { isValid: true, sanitizedData };
  }, []);

  const validate = useCallback(async (data: Record<string, any>, rules: ValidationRule[]) => {
    const result = await sanitizeAndValidate(data, rules, { enableSanitization: true });
    return result.isValid;
  }, [sanitizeAndValidate]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    errors,
    isValidating,
    validate,
    sanitizeAndValidate,
    clearErrors,
    clearFieldError,
    validators: {
      validateEmail,
      validateRequired,
      validateMinLength,
      validateMaxLength,
      validateNumericRange,
      validatePassword,
      validateContent,
    },
  };
}
