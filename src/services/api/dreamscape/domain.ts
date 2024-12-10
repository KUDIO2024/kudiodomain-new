import { DREAMSCAPE_CONFIG, DOMAIN_EXTENSIONS } from './constants';
import { makeDreamscapeRequest } from './request';
import { DreamscapeError } from '../errors';
import type { DreamscapeDomain } from './types';

export async function checkDomainAvailability(domain: string): Promise<DreamscapeDomain[]> {
  // Build query parameters for each domain extension
  const queryParams: Record<string, string> = {};
  DOMAIN_EXTENSIONS.forEach((ext, index) => {
    queryParams[`domain_names[${index}]`] = `${domain}.${ext}`;
  });

  try {
    const response = await makeDreamscapeRequest<DreamscapeDomain[]>(
      DREAMSCAPE_CONFIG.ENDPOINTS.DOMAIN_AVAILABILITY,
      { method: 'GET' },
      queryParams
    );

    if (!Array.isArray(response.data)) {
      throw new DreamscapeError('Invalid response format');
    }

    return response.data.map(domain => ({
      domain_name: domain.domain_name,
      is_available: domain.is_available,
      register_price: Number(domain.register_price),
      renew_price: Number(domain.renew_price || domain.register_price),
      status: domain.status,
    }));
  } catch (error) {
    console.error('Error checking domain availability:', error);
    throw error;
  }
}