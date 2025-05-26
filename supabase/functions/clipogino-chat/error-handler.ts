
export interface ErrorResponse {
  error: string;
  message: string;
  details?: string;
}

export function handleError(error: unknown): { status: number; response: ErrorResponse } {
  console.error('Error in clipogino-chat function:', error);
  
  // Return appropriate error response based on error type
  if (error instanceof Error && error.message.includes('Cost limit exceeded')) {
    return {
      status: 429,
      response: {
        error: 'Usage limit reached',
        message: 'You have reached your daily AI usage limit. Please try again tomorrow or upgrade your plan.',
        details: error.message
      }
    };
  }

  if (error instanceof Error && error.message.includes('Authorization required')) {
    return {
      status: 401,
      response: {
        error: 'Authorization required',
        message: 'Please provide valid authentication credentials.'
      }
    };
  }

  if (error instanceof Error && error.message.includes('Invalid authentication')) {
    return {
      status: 401,
      response: {
        error: 'Invalid authentication',
        message: 'Your authentication credentials are invalid or expired.'
      }
    };
  }

  return {
    status: 500,
    response: {
      error: 'Internal server error',
      message: 'An error occurred while processing your request. Please try again.'
    }
  };
}
