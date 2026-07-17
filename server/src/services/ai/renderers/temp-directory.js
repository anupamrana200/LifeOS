import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

import { TEMP_ROOT } from './constants.js';

export const createTempDirectory = async () => {
  await fs.mkdir(TEMP_ROOT, {
    recursive: true,
  });

  const directory = path.join(
    TEMP_ROOT,
    crypto.randomUUID()
  );

  await fs.mkdir(directory);

  return directory;
};

export const removeTempDirectory = async (
  directory
) => {
  try {
    await fs.rm(directory, {
      recursive: true,
      force: true,
    });
  } catch {
    // Ignore cleanup errors.
  }
};