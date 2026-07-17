import scheduler from '../src/services/ai/ocr/scheduler.js';

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

for (let i = 1; i <= 5; i++) {
  scheduler.enqueue(async () => {
    console.log(`Job ${i} started`);

    await delay(1000);

    console.log(`Job ${i} finished`);

    return i;
  });
}