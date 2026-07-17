import fs from 'fs/promises';
import { extractImage } from '../src/services/ai/extractors/image.extractor.js';
import workerManager from '../src/services/ai/ocr/worker-manager.js';

const buffer = await fs.readFile('./sample.png');

const result = await extractImage({
  buffer,
});

console.log(result);

await workerManager.terminate();