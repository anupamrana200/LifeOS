import fs from 'fs/promises';
import path from 'path';

import { renderPdf } from '../src/services/ai/renderers/pdf.renderer.js';

const pdfBuffer = await fs.readFile('./sample.pdf');

const pages = await renderPdf({
  buffer: pdfBuffer,
});

console.log(`Rendered ${pages.length} page(s).`);

await fs.mkdir('./output', { recursive: true });

for (const page of pages) {
  const filePath = path.join(
    './output',
    `page-${page.pageNumber}.png`
  );

  await fs.writeFile(filePath, page.imageBuffer);

  console.log(`Saved ${filePath}`);
}