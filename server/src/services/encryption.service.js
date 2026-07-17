import crypto from 'node:crypto';
import fs from 'node:fs/promises';

import env from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const ENCRYPTION_KEY = Buffer.from(env.fileEncryptionKey, 'hex');

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error(
    'FILE_ENCRYPTION_KEY must be a 64-character hexadecimal string.',
  );
}

/**
 * Encrypt a Buffer.
 */
export const encryptBuffer = (buffer) => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    iv,
  );

  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([
    iv,
    authTag,
    encrypted,
  ]);
};

/**
 * Decrypt a Buffer.
 */
export const decryptBuffer = (buffer) => {
  const iv = buffer.subarray(0, IV_LENGTH);

  const authTag = buffer.subarray(
    IV_LENGTH,
    IV_LENGTH + AUTH_TAG_LENGTH,
  );

  const encrypted = buffer.subarray(
    IV_LENGTH + AUTH_TAG_LENGTH,
  );

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    iv,
  );

  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
};

/**
 * Encrypt a file.
 */
export const encryptFile = async (
  inputPath,
  outputPath,
) => {
  const fileBuffer = await fs.readFile(inputPath);

  const encrypted = encryptBuffer(fileBuffer);

  await fs.writeFile(outputPath, encrypted);
};

/**
 * Decrypt a file.
 */
export const decryptFile = async (
  inputPath,
  outputPath,
) => {
  const encrypted = await fs.readFile(inputPath);

  const decrypted = decryptBuffer(encrypted);

  await fs.writeFile(outputPath, decrypted);
};