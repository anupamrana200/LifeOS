import workerManager from '../src/services/ai/ocr/worker-manager.js';

await workerManager.initialize();

console.log(workerManager.workers);

await workerManager.terminate();