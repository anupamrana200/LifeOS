export default class EmbeddingProvider {
  async generate(texts, model) {
    throw new Error('generate() must be implemented by the provider.');
  }
}
