import axios from 'axios';
import { DREAMSCAPE_CONFIG } from '../config/dreamscape.js';
import { generateRequestID, generateSignature, createHeaders } from '../utils/dreamscape.js';

const api = axios.create({
  baseURL: DREAMSCAPE_CONFIG.BASE_URL,
  validateStatus: null,
});

export async function checkDomainAvailability(domain) {
  const requestId = generateRequestID();
  const signature = generateSignature(requestId, DREAMSCAPE_CONFIG.API_KEY);
  
  const params = new URLSearchParams();
  DREAMSCAPE_CONFIG.DOMAIN_EXTENSIONS.forEach(ext => {
    params.append('domain_names[]', `${domain}.${ext}`);
  });
  params.append('currency', 'GBP');

  try {
    const response = await api.get(
      `${DREAMSCAPE_CONFIG.ENDPOINTS.DOMAIN_AVAILABILITY}?${params.toString()}`,
      { headers: createHeaders(requestId, signature) }
    );

    if (response.status === 429) {
      throw new Error('Rate limit exceeded');
    }

    if (!response.data.status) {
      throw new Error(response.data.error_message || 'Failed to check domain availability');
    }

    return response.data;
  } catch (error) {
    console.error('Error checking domain availability:', error);
    throw error;
  }
}

export async function registerCustomer(customerData) {
  const requestId = generateRequestID();
  const signature = generateSignature(requestId, DREAMSCAPE_CONFIG.API_KEY);

  try {
    const response = await api.post(
      DREAMSCAPE_CONFIG.ENDPOINTS.CUSTOMER_REGISTER,
      customerData,
      { headers: createHeaders(requestId, signature) }
    );

    if (!response.data.status) {
      throw new Error(response.data.error_message || 'Failed to register customer');
    }

    return response.data;
  } catch (error) {
    console.error('Error registering customer:', error);
    throw error;
  }
}

export async function registerDomain(domainData) {
  const requestId = generateRequestID();
  const signature = generateSignature(requestId, DREAMSCAPE_CONFIG.API_KEY);

  try {
    const response = await api.post(
      DREAMSCAPE_CONFIG.ENDPOINTS.DOMAIN_REGISTER,
      domainData,
      { headers: createHeaders(requestId, signature) }
    );

    if (!response.data.status) {
      throw new Error(response.data.error_message || 'Failed to register domain');
    }

    return response.data;
  } catch (error) {
    console.error('Error registering domain:', error);
    throw error;
  }
}

export async function registerEmailHosting(emailData) {
  const requestId = generateRequestID();
  const signature = generateSignature(requestId, DREAMSCAPE_CONFIG.API_KEY);

  try {
    const response = await api.post(
      DREAMSCAPE_CONFIG.ENDPOINTS.EMAIL_PACKAGE_REGISTER,
      emailData,
      { headers: createHeaders(requestId, signature) }
    );

    if (!response.data.status) {
      throw new Error(response.data.error_message || 'Failed to register email hosting');
    }

    return response.data;
  } catch (error) {
    console.error('Error registering email hosting:', error);
    throw error;
  }
}