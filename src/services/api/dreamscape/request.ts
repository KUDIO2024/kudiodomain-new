import axios, { AxiosError } from 'axios';
import { DREAMSCAPE_CONFIG } from './constants';
import { generateRequestID, generateSignature } from '../../../utils/dreamscape';
import { RateLimiter } from '../../../utils/rateLimit';
import { DreamscapeError, NetworkError, RateLimitError } from '../errors';
import type { DreamscapeResponse } from './types';

// Initialize rate limiter with 1 request per second
const rateLimiter = new RateLimiter(1);

const api = axios.create({
  baseURL: DREAMSCAPE_CONFIG.BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  validateStatus: null,
});

export async function makeDreamscapeRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  queryParams: Record<string, string> = {}
): Promise<DreamscapeResponse<T>> {
  const requestId = generateRequestID();
  const signature = generateSignature(requestId, DREAMSCAPE_CONFIG.API_KEY);

  const params = new URLSearchParams({
    ...queryParams,
    currency: 'GBP',
  });

  const url = `${endpoint}${params.toString() ? '?' + params.toString() : ''}`;

  const request = async () => {
    try {
      const response = await api({
        url,
        method: options.method || 'GET',
        headers: {
          'Api-Request-Id': requestId,
          'Api-Signature': signature,
          'Reseller-ID': DREAMSCAPE_CONFIG.RESELLER_ID,
          ...options.headers,
        },
        data: options.body ? JSON.parse(options.body as string) : undefined,
      });

      if (response.status === 429) {
        throw new RateLimitError(1, 'dreamscape');
      }

      if (!response.data.status) {
        throw new DreamscapeError(
          response.data.error_message || 'API request failed',
          response.status,
          response.data
        );
      }

      return response.data as DreamscapeResponse<T>;
    } catch (error) {
      if (error instanceof DreamscapeError || error instanceof RateLimitError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (!axiosError.response) {
          throw new NetworkError();
        }
        throw new DreamscapeError(
          axiosError.response.data?.error_message || 'API request failed',
          axiosError.response.status,
          axiosError.response.data
        );
      }

      throw new DreamscapeError('Failed to process request');
    }
  };

  return rateLimiter.add(request);
}