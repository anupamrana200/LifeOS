import path from 'path';
import os from 'os';

export const DEFAULT_DPI =
  Number(process.env.PDF_RENDER_DPI) || 300;

export const IMAGE_FORMAT = 'png';

export const POPPLER_COMMAND =
  process.platform === 'win32'
    ? 'pdftocairo.exe'
    : 'pdftocairo';

export const TEMP_ROOT = path.join(
  os.tmpdir(),
  'lifeos-pdf-renderer'
);