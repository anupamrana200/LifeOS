class ProviderInterface {
  async generate({
    messages,
    model,
  }) {
    throw new Error(
      'generate() must be implemented.'
    );
  }

  async generateStream({
    messages,
    model,
    onToken,
  }) {
    throw new Error(
      'generateStream() must be implemented.'
    );
  }
}

export default ProviderInterface;