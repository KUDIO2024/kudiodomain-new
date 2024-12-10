import { DREAMSCAPE_CONFIG, DOMAIN_EXTENSIONS } from '../../config/dreamscape';
import { generateRequestID, generateSignature } from '../../utils/dreamscape';
import { RateLimiter } from '../../utils/rateLimit';
import { DreamscapeError, NetworkError, RateLimitError, handleDreamscapeError } from './errors';
import type { DreamscapeDomain, DreamscapeResponse } from '../../types/dreamscape';

// Initialize rate limiter with 1 request per second as per API docs
const rateLimiter = new RateLimiter(1);

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit,
  requestId: string,
  signature: string
): Promise<DreamscapeResponse<T>> {
  try {
    const response = await fetch(
      `${DREAMSCAPE_CONFIG.BASE_URL}${endpoint}`,
      {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Api-Request-Id': requestId,
          'Api-Signature': signature,
          'Reseller-ID': DREAMSCAPE_CONFIG.RESELLER_ID,
          ...options.headers,
        },
      }
    );

    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch {
      throw new DreamscapeError('Invalid JSON response from server');
    }

    if (response.status === 429) {
      throw new RateLimitError(1, 'dreamscape');
    }

    if (!response.ok) {
      throw new DreamscapeError(
        data.error_message || `HTTP error! status: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    handleDreamscapeError(error);
  }
}

export async function checkDomainAvailability(domain: string): Promise<DreamscapeDomain[]> {
  const requestId = generateRequestID();
  const signature = generateSignature(requestId, DREAMSCAPE_CONFIG.API_KEY);
  
  const domainQueries = DOMAIN_EXTENSIONS.map(ext => 
    `domain_names[]=${encodeURIComponent(domain)}.${ext}`
  ).join('&');
  
  const url = `${DREAMSCAPE_CONFIG.ENDPOINTS.DOMAIN_AVAILABILITY}?${domainQueries}&currency=GBP`;

  try {
    const data = await rateLimiter.add(async () => {
      const response = await makeRequest<DreamscapeDomain[]>(
        url,
        { method: 'GET' },
        requestId,
        signature
      );

      if (!response.status || !Array.isArray(response.data)) {
        throw new DreamscapeError('Invalid response format');
      }

      return response.data;
    });

    return data;
  } catch (error) {
    console.error('Error checking domain availability:', error);
    throw error;
  }
}

// Rest of the file remains unchanged...