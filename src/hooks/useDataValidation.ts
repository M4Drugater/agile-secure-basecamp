
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ValidationRule {
  field: string;
  validator: (value: any) => boolean;
  message: string;
}

export function useDataValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateRequired = (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  };

  const validateMinLength = (value: string, minLength: number): boolean => {
    return value && value.length >= minLength;
  };

  const validateMaxLength = (value: string, maxLength: number): boolean => {
    return !value || value.length <= maxLength;
  };

  const validateNumericRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  };

  const validate = useCallback(async (data: Record<string, any>, rules: ValidationRule[]) => {
    setIsValidating(true);
    const newErrors: Record<string, string> = {};

    for (const rule of rules) {
      const value = data[rule.field];
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
      return false;
    }

    return true;
  }, []);

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
    clearErrors,
    clearFieldError,
    validators: {
      validateEmail,
      validateRequired,
      validateMinLength,
      validateMaxLength,
      validateNumericRange,
    },
  };
}
