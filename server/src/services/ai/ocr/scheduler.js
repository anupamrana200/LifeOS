import workerManager from './worker-manager.js';

class Scheduler {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.shuttingDown = false;
  }

  enqueue(handler) {
    if (this.shuttingDown) {
      throw new Error('Scheduler is shutting down.');
    }

    return new Promise((resolve, reject) => {
      this.queue.push({
        handler,
        resolve,
        reject,
      });

      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0 && !this.shuttingDown) {
      const worker = await workerManager.acquireWorker();

      const job = this.queue.shift();

      if (!job) {
        workerManager.releaseWorker(worker);
        continue;
      }

      this.executeJob(worker, job);
    }

    this.processing = false;
  }

  async executeJob(worker, job) {
    try {
      const result = await job.handler(worker);

      job.resolve(result);
    } catch (error) {
      job.reject(error);
    } finally {
      workerManager.releaseWorker(worker);

      if (this.queue.length > 0) {
        this.processQueue();
      }
    }
  }

  get size() {
    return this.queue.length;
  }

  get isIdle() {
    return (
      this.queue.length === 0 &&
      workerManager.busyCount === 0
    );
  }

  async shutdown() {
    this.shuttingDown = true;

    while (!this.isIdle) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
}

export default new Scheduler();