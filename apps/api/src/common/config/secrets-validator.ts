/**
 * Validates required secrets at application startup
 * Throws error if any secret is missing or invalid
 */
export function validateSecrets(): void {
  const errors: string[] = [];

  // JWT_SECRET validation
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    errors.push('JWT_SECRET is required');
  } else if (jwtSecret.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long');
  }

  // Add other secret validations here as needed
  // Example: DATABASE_URL, REDIS_URL, etc.

  if (errors.length > 0) {
    const errorMessage = [
      '❌ Security Configuration Error:',
      ...errors.map(err => `   - ${err}`),
      '',
      'Please set all required secrets in your environment configuration.'
    ].join('\n');
    
    throw new Error(errorMessage);
  }
}
