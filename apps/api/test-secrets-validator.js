// Test script for secrets validator
process.env.JWT_SECRET = ''; // Empty

try {
  const { validateSecrets } = require('./dist/common/config/secrets-validator');
  validateSecrets();
  console.log('FAIL: Should have thrown error');
} catch (error) {
  console.log('✅ SUCCESS: Validation failed as expected');
  console.log('Error message:');
  console.log(error.message);
}

// Test with short secret
process.env.JWT_SECRET = 'short';
try {
  const { validateSecrets } = require('./dist/common/config/secrets-validator');
  validateSecrets();
  console.log('FAIL: Should have thrown error for short secret');
} catch (error) {
  console.log('\n✅ SUCCESS: Short secret rejected');
  console.log('Error message:');
  console.log(error.message);
}

// Test with valid secret
process.env.JWT_SECRET = 'this-is-a-valid-secret-key-with-32-plus-characters';
try {
  const { validateSecrets } = require('./dist/common/config/secrets-validator');
  validateSecrets();
  console.log('\n✅ SUCCESS: Valid secret accepted');
} catch (error) {
  console.log('FAIL: Should not have thrown error');
  console.log(error.message);
}
