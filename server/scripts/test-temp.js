import fs from 'fs/promises';

import { renderPdfPages } from '../src/services/ai/renderers/pdf.renderer.js';

const buffer = await fs.readFile('./sample.pdf');

const pages = await renderPdfPages({
  buffer,
});

console.log(pages.length);