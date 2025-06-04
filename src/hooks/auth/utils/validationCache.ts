
interface ValidationCache {
  isValid: boolean;
  shouldSignOut: boolean;
  timestamp: number;
}

export class SessionValidationCache {
  private cache: ValidationCache | null = null;
  private readonly CACHE_DURATION = 30 * 1000; // 30 seconds

  get(key: string): ValidationCache | null {
    if (!this.cache || Date.now() - this.cache.timestamp > this.CACHE_DURATION) {
      return null;
    }
    return this.cache;
  }

  set(result: { isValid: boolean; shouldSignOut: boolean }): void {
    this.cache = {
      ...result,
      timestamp: Date.now()
    };
  }

  clear(): void {
    this.cache = null;
  }
}
