import fs from 'fs/promises';

import textExtractionService from '../src/services/ai/text-extraction.service.js';
import workerManager from '../src/services/ai/ocr/worker-manager.js';

const TEST_FILES = [
  {
    filename: 'sample.pdf',
    mimetype: 'application/pdf',
  },
  {
    filename: 'sample.png',
    mimetype: 'image/png',
  },
  {
    filename: 'sample.docx',
    mimetype:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    filename: 'sample.txt',
    mimetype: 'text/plain',
  },
];

for (const file of TEST_FILES) {
  console.log('\n====================================');
  console.log(file.filename);

  const buffer = await fs.readFile(`./${file.filename}`);

  console.time(file.filename);

  const result = await textExtractionService.extract({
    buffer,
    filename: file.filename,
    mimetype: file.mimetype,
  });

  console.timeEnd(file.filename);

  console.log(result.metadata);

  console.log(result.text.substring(0, 300));
}

await workerManager.terminate();