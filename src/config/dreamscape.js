export const DREAMSCAPE_CONFIG = {
  API_KEY: process.env.DREAMSCAPE_API_KEY,
  RESELLER_ID: process.env.DREAMSCAPE_RESELLER_ID,
  BASE_URL: 'https://reseller-api.ds.network',
  ENDPOINTS: {
    DOMAIN_AVAILABILITY: '/domains/availability',
    DOMAIN_REGISTER: '/domains',
    CUSTOMER_REGISTER: '/customers',
    EMAIL_PACKAGE_REGISTER: '/products/email-hostings',
  },
  EMAIL_PLANS: {
    basic: { id: 47, price: 19.20 },
    standard: { id: 48, price: 43.20 },
    business: { id: 49, price: 69.99 },
  },
};

export const DOMAIN_EXTENSIONS = ['co.uk', 'com', 'org', 'org.uk', 'uk'];