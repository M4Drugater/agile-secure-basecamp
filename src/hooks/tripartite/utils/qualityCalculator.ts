
export function calculateQualityScore(webData: any, response: string): number {
  let score = 0.4; // Base score

  // Web data availability
  if (webData.sources && webData.sources.length > 0) {
    score += 0.3;
  }

  // Response completeness
  if (response.length > 500) {
    score += 0.2;
  }

  // Source citations in response
  if (webData.sources && webData.sources.some((source: string) => response.includes(source))) {
    score += 0.1;
  }

  return Math.min(score, 1.0);
}
