import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import env from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const VERSION = 1;
const MAGIC = Buffer.from('LIFEOS');
const keyMaterial = env.dataEncryptionKey || env.fileEncryptionKey;
const ENCRYPTION_KEY = Buffer.from(keyMaterial, 'hex');

if (ENCRYPTION_KEY.length !== 32) throw new Error('DATA_ENCRYPTION_KEY must be a 64-character hexadecimal string.');

const asBuffer = (value) => Buffer.isBuffer(value) ? value : Buffer.from(String(value), 'utf8');
const aadBuffer = (context) => context ? Buffer.from(`lifeos:${context}`, 'utf8') : null;

export const isEncrypted = (value) => typeof value === 'string' && value.startsWith('lifeos:v1:');

export const encryptBuffer = (value, context) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv, { authTagLength: AUTH_TAG_LENGTH });
  const aad = aadBuffer(context);
  if (aad) cipher.setAAD(aad);
  const encrypted = Buffer.concat([cipher.update(asBuffer(value)), cipher.final()]);
  return Buffer.concat([MAGIC, Buffer.from([VERSION]), iv, cipher.getAuthTag(), encrypted]);
};

export const decryptBuffer = (value, context) => {
  const buffer = asBuffer(value);
  const hasHeader = buffer.subarray(0, MAGIC.length).equals(MAGIC);
  const offset = hasHeader ? MAGIC.length + 1 : 0;
  if (hasHeader && buffer[MAGIC.length] !== VERSION) throw new Error('Unsupported encrypted payload version.');
  if (buffer.length < offset + IV_LENGTH + AUTH_TAG_LENGTH + 1) throw new Error('Invalid encrypted payload.');
  const iv = buffer.subarray(offset, offset + IV_LENGTH);
  const authTag = buffer.subarray(offset + IV_LENGTH, offset + IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = buffer.subarray(offset + IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv, { authTagLength: AUTH_TAG_LENGTH });
  const aad = aadBuffer(context);
  if (aad && hasHeader) decipher.setAAD(aad);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};

export const encryptText = (value, context) => {
  if (value === null || value === undefined || isEncrypted(value)) return value;
  return `lifeos:v1:${encryptBuffer(value, context).toString('base64url')}`;
};

export const decryptText = (value, context) => {
  if (value === null || value === undefined || !isEncrypted(value)) return value;
  return decryptBuffer(Buffer.from(value.slice('lifeos:v1:'.length), 'base64url'), context).toString('utf8');
};

export const encryptJson = (value, context) => value === null || value === undefined ? value : encryptText(JSON.stringify(value), context);
export const decryptJson = (value, context) => {
  const plaintext = decryptText(value, context);
  if (plaintext === null || plaintext === undefined || plaintext === value) return value;
  return JSON.parse(plaintext);
};

export const blindIndex = (value, context) => crypto.createHmac('sha256', ENCRYPTION_KEY).update(`${context}:${String(value).trim().toLowerCase()}`).digest('hex');

export const encryptFile = async (inputPath, outputPath, context) => fs.writeFile(outputPath, encryptBuffer(await fs.readFile(inputPath), context));
export const decryptFile = async (inputPath, outputPath, context) => fs.writeFile(outputPath, decryptBuffer(await fs.readFile(inputPath), context));
