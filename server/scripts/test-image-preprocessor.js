import fs from 'fs/promises';

import { preprocessImage } from '../src/services/ai/ocr/image-preprocessor.js';

const image = await fs.readFile('./sample.png');

const processed = await preprocessImage({
  buffer: image,
});

await fs.writeFile('./processed.png', processed);

console.log('Image preprocessing successful.');