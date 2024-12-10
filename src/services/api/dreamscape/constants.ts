export const DREAMSCAPE_CONFIG = {
  API_KEY: 'a86ee953175fb654f83bc1e1fb91cdd6',
  RESELLER_ID: '28076',
  BASE_URL: 'https://reseller-api.ds.network',
  ENDPOINTS: {
    DOMAIN_AVAILABILITY: '/domains/availability',
    DOMAIN_REGISTER: '/domains',
    CUSTOMER_REGISTER: '/customers',
    EMAIL_PACKAGE_REGISTER: '/products/email-hostings',
    TLDS: '/domains/tlds',
  },
  EMAIL_PLANS: {
    basic: { id: 47, price: 19.20 },
    standard: { id: 48, price: 43.20 },
    business: { id: 49, price: 69.99 },
  },
} as const;

export const DOMAIN_EXTENSIONS = [
  'co.uk',
  'com',
  'uk',
  'org',
  'org.uk',
] as const;