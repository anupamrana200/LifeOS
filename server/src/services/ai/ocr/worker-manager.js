import { createWorker } from 'tesseract.js';

const OCR_LANGUAGE = process.env.OCR_LANGUAGE || 'eng';
const OCR_CONCURRENCY = Number(process.env.OCR_CONCURRENCY || 4);

class WorkerManager {
  constructor() {
    this.workers = [];

    this.availableWorkers = [];

    this.waitingResolvers = [];

    this.initialized = false;
    this.initializing = null;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    if (this.initializing) {
      return this.initializing;
    }

    this.initializing = this.#createWorkers();

    return this.initializing;
  }

  async #createWorkers() {
    for (let i = 0; i < OCR_CONCURRENCY; i++) {
      const worker = await createWorker(OCR_LANGUAGE);

      const instance = {
        id: i + 1,
        worker,
      };

      this.workers.push(instance);
      this.availableWorkers.push(instance);

      console.log(`OCR Worker ${i + 1} initialized.`);
    }

    this.initialized = true;
  }

  async acquireWorker() {
    await this.initialize();

    if (this.availableWorkers.length > 0) {
      return this.availableWorkers.shift();
    }

    return new Promise((resolve) => {
      this.waitingResolvers.push(resolve);
    });
  }

  releaseWorker(worker) {
    if (!worker) {
      return;
    }

    if (this.waitingResolvers.length > 0) {
      const resolve = this.waitingResolvers.shift();

      resolve(worker);

      return;
    }

    this.availableWorkers.push(worker);
  }

  get totalWorkers() {
    return this.workers.length;
  }

  get availableCount() {
    return this.availableWorkers.length;
  }

  get busyCount() {
    return this.totalWorkers - this.availableWorkers.length;
  }

  async terminate() {
    await Promise.all(
      this.workers.map(({ worker }) => worker.terminate())
    );

    this.workers = [];
    this.availableWorkers = [];
    this.waitingResolvers = [];

    this.initialized = false;
    this.initializing = null;

    console.log('Worker Manager terminated.');
  }
}

const workerManager = new WorkerManager();

export default workerManager;