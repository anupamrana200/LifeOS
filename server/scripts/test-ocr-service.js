import fs from 'fs/promises';

import ocrService from '../src/services/ai/ocr/ocr.service.js';
import workerManager from '../src/services/ai/ocr/worker-manager.js';

const files = [
  './sample1.png',
  './sample2.png',
  './sample3.png',
];

const buffers = await Promise.all(
  files.map(file => fs.readFile(file))
);

console.time('OCR Batch');

const result = await ocrService.extractBatch({
  buffers,
});

console.timeEnd('OCR Batch');

console.log('\n=============================\n');

result.pages.forEach((page, index) => {
  console.log(`Page ${index + 1}`);

  console.log('Confidence:', page.confidence);

  console.log(page.text);

  console.log('\n-----------------------------\n');
});

console.log(result);

await workerManager.terminate();