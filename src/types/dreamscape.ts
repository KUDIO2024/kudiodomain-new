export interface DreamscapeDomain {
  domain_name: string;
  is_available: boolean;
  register_price: number;
}

export interface DreamscapeResponse<T> {
  status: boolean;
  data?: T;
  error_message?: string;
  validation_errors?: Record<string, string[]>;
}