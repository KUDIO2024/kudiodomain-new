export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class FlowluApiError extends ApiError {
  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message, statusCode, details);
    this.name = 'FlowluApiError';
  }
}

export class NetworkError extends Error {
  constructor() {
    super('Unable to connect to the server. Please check your internet connection.');
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends ApiError {
  constructor(retryAfter: number, provider: 'flowlu' | 'dreamscape') {
    super(
      'Request rate per second exceeded',
      429,
      { retryAfter, provider }
    );
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, errors: Record<string, string[]>) {
    super(message, 400, errors);
    this.name = 'ValidationError';
  }
}

export function handleFlowluError(error: unknown): never {
  if (error instanceof ApiError) {
    throw error;
  }
  
  if (error instanceof Error) {
    throw new FlowluApiError(error.message);
  }
  
  throw new FlowluApiError('An unexpected error occurred');
}