import { config } from './env';

export const STRIPE_CONFIG = {
  publishableKey: config.STRIPE_PUBLIC_KEY,
} as const;