export interface DreamscapeDomain {
  domain_name: string;
  is_available: boolean;
  register_price: number;
  renew_price: number;
  status?: string;
}

export interface DreamscapeCustomer {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface DreamscapeResponse<T> {
  status: boolean;
  data?: T;
  error_message?: string;
  validation_errors?: Record<string, string[]>;
}

export interface DreamscapeError {
  status: false;
  error_message: string;
  validation_errors?: Record<string, string[]>;
}