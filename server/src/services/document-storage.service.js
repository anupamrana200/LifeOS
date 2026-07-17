import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  encryptBuffer,
  decryptBuffer,
} from './encryption.service.js';

const STORAGE_DIRECTORY = path.resolve('src/uploads/encrypted');

await fs.mkdir(STORAGE_DIRECTORY, { recursive: true });

export const saveEncryptedDocument = async (fileBuffer) => {
  const encryptedBuffer = encryptBuffer(fileBuffer);

  const fileName = `${crypto.randomUUID()}.lifeos`;

  const storagePath = path.join(STORAGE_DIRECTORY, fileName);

  await fs.writeFile(storagePath, encryptedBuffer);

  return {
    fileName,
    storagePath,
  };
};

export const readEncryptedDocument = async (storagePath) => {
  const encryptedBuffer = await fs.readFile(storagePath);

  return decryptBuffer(encryptedBuffer);
};

export const deleteEncryptedDocument = async (storagePath) => {
  await fs.unlink(storagePath);
};