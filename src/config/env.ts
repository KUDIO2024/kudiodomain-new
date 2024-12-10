const ENV = {
  STRIPE_PUBLIC_KEY: 'pk_live_51IZk6CLWcouNeT9dEsKDBTHFbAkgA0Rw2tgDPtQGoSh3o9O4iIau65jUfwScLfle9ZsFctQ46j51wrRMN3dK0HlX009Sq9G9oR',
} as const;

// Validate required environment variables
Object.entries(ENV).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const config = ENV;