import { DREAMSCAPE_CONFIG } from './constants';
import { makeDreamscapeRequest } from './request';
import type { DreamscapeResponse } from './types';
import type { EmailPlan } from '../../../types/checkout';

export async function registerEmailHosting(
  domainName: string,
  customerId: number,
  plan: EmailPlan
): Promise<DreamscapeResponse<any>> {
  if (!plan || !DREAMSCAPE_CONFIG.EMAIL_PLANS[plan]) {
    throw new Error('Invalid email plan selected');
  }

  return makeDreamscapeRequest(
    DREAMSCAPE_CONFIG.ENDPOINTS.EMAIL_PACKAGE_REGISTER,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domain_name: domainName,
        plan_id: DREAMSCAPE_CONFIG.EMAIL_PLANS[plan].id,
        customer_id: customerId,
        period: 12,
      }),
    }
  );
}