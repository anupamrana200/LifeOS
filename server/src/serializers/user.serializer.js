import { decryptText } from '../services/encryption.service.js';

export const toUserResponse = (user) => {
  const raw = user.toObject?.() || user;
  const { password, emailHash, __v, ...safe } = raw;
  return { ...safe, fullName: decryptText(safe.fullName, 'user.fullName'), email: decryptText(safe.email, 'user.email') };
};
