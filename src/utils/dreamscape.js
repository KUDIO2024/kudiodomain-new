import md5 from 'md5';

export function generateRequestID() {
  return md5(Date.now().toString() + Math.random().toString());
}

export function generateSignature(requestId, apiKey) {
  return md5(requestId + apiKey);
}

export function createHeaders(requestId, signature) {
  return {
    'Api-Request-Id': requestId,
    'Api-Signature': signature,
    'Reseller-ID': process.env.DREAMSCAPE_RESELLER_ID,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
}