import { MD5 } from 'crypto-js';

export function generateRequestID(): string {
  return MD5(Date.now().toString() + Math.random().toString()).toString();
}

export function generateSignature(requestId: string, apiKey: string): string {
  return MD5(requestId + apiKey).toString();
}