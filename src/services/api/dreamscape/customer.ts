import { DREAMSCAPE_CONFIG } from './constants';
import { makeDreamscapeRequest } from './request';
import type { DreamscapeCustomer, DreamscapeResponse } from './types';
import type { UserDetails } from '../../../types/checkout';

export async function registerCustomer(
  userDetails: UserDetails
): Promise<DreamscapeResponse<DreamscapeCustomer>> {
  return makeDreamscapeRequest<DreamscapeCustomer>(
    DREAMSCAPE_CONFIG.ENDPOINTS.CUSTOMER_REGISTER,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: userDetails.firstName,
        last_name: userDetails.lastName,
        email: userDetails.email,
        phone: userDetails.phone,
        address_line_1: userDetails.address.line1,
        address_line_2: userDetails.address.line2,
        city: userDetails.address.city,
        state: userDetails.address.region,
        post_code: userDetails.address.postalCode,
        country: 'GB',
        account_type: 'personal',
      }),
    }
  );
}