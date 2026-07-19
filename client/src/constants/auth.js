export const AUTH_STORAGE_KEYS = Object.freeze({
  rememberMe: 'lifeos-remember-me',
});

export const PASSWORD_REQUIREMENTS = Object.freeze([
  { key: 'minLength', label: 'At least 8 characters' },
  { key: 'uppercase', label: 'One uppercase letter' },
  { key: 'lowercase', label: 'One lowercase letter' },
  { key: 'number', label: 'One number' },
  { key: 'special', label: 'One special character' },
]);
