import { spawn } from 'child_process';

import { POPPLER_COMMAND } from './constants.js';

export const runPoppler = (
  args,
  cwd = process.cwd()
) =>
  new Promise((resolve, reject) => {
    const child = spawn(
      POPPLER_COMMAND,
      args,
      {
        cwd,
        windowsHide: true,
      }
    );

    let stderr = '';

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          [
            `Poppler exited with code ${code}.`,
            `Command: ${POPPLER_COMMAND} ${args.join(' ')}`,
            stderr.trim(),
          ]
            .filter(Boolean)
            .join('\n')
        )
      );
    });
  });
