
interface PerplexityRequest {
  messages: any[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  search_recency_filter?: string;
}

export class PerplexityClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendChatRequest(request: PerplexityRequest) {
    console.log('🔍 Calling Perplexity API:', request.model);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature || 0.1,
        max_tokens: request.max_tokens || 2000,
        return_citations: true,
        search_recency_filter: request.search_recency_filter || 'month',
        search_domain_filter: [],
        return_images: false,
        return_related_questions: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Perplexity');
    }

    console.log('✅ Perplexity response received');
    return data;
  }
}
