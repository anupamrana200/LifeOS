export default class ProviderInterface {
  async generate() {
    throw new Error(
      'generate() must be implemented.'
    );
  }
}