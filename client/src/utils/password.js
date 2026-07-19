export const getPasswordRequirements = (password = '') => ({
  minLength: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
});

export const isStrongPassword = (password) => Object.values(getPasswordRequirements(password)).every(Boolean);

export const getPasswordStrength = (password) => {
  const passedRequirements = Object.values(getPasswordRequirements(password)).filter(Boolean).length;
  if (!password) return { label: '', score: 0 };
  if (passedRequirements <= 2) return { label: 'Weak', score: 1 };
  if (passedRequirements <= 4) return { label: 'Fair', score: 2 };
  return { label: 'Strong', score: 3 };
};
