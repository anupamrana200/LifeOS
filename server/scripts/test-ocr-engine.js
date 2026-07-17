import fs from 'fs/promises';

import ocrEngine from '../src/services/ai/ocr/ocr-engine.js';
import { preprocessImage } from '../src/services/ai/ocr/image-preprocessor.js';

const image = await fs.readFile('./sample.png');

const processed = await preprocessImage({
  buffer: image,
});

const result = await ocrEngine.recognize(processed);

console.log(result);

await ocrEngine.terminate();