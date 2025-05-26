
// Token counting utility for more accurate estimation
export function countTokens(text: string): number {
  // More sophisticated token counting
  // This is a simplified approximation - in production you might want to use tiktoken library
  const words = text.split(/\s+/).length;
  const chars = text.length;
  
  // Rough estimation: 1 token ≈ 0.75 words or 4 characters
  return Math.ceil(Math.max(words * 1.33, chars / 4));
}
