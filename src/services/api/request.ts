import { FLOWLU_CONFIG } from './config';
import { RateLimiter } from '../../utils/rateLimit';
import { FlowluApiError, NetworkError, RateLimitError, ValidationError } from './errors';
import type { FlowluResponse } from './types';

const rateLimiter = new RateLimiter(1); // 1 request per second

async function parseResponse(response: Response): Promise<any> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error('Invalid JSON response:', text);
    throw new FlowluApiError('Invalid response from server');
  }
}

export async function makeRequest<T>(
  endpoint: string,
  data: Record<string, any>,
  priority = false
): Promise<FlowluResponse<T>> {
  const url = `${FLOWLU_CONFIG.BASE_URL}${endpoint}`;
  const formData = new URLSearchParams();
  
  // Always add API key first
  formData.append('api_key', FLOWLU_CONFIG.API_KEY);
  
  // Add all other data fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const request = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const responseData = await parseResponse(response);

      if (response.status === 429) {
        throw new RateLimitError(1, 'flowlu');
      }

      if (response.status === 400 && responseData.errors) {
        throw new ValidationError('Validation failed', responseData.errors);
      }

      if (!response.ok || responseData.error) {
        throw new FlowluApiError(
          responseData.error || `HTTP error! status: ${response.status}`,
          response.status,
          responseData
        );
      }

      return {
        success: true,
        data: responseData.response || responseData
      };
    } catch (error) {
      if (error instanceof FlowluApiError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError();
      }
      
      throw new FlowluApiError('Failed to process request');
    }
  };

  return rateLimiter.add(request);
}