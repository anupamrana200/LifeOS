import { getProvider } from '../providers/provider.factory.js';
import { DEFAULT_PROVIDER } from '../providers/constants.js';

class GenerationService {

  async generate({
    provider,
    messages,
  }) {

    const aiProvider = getProvider(
      provider ?? DEFAULT_PROVIDER,
    );

    return aiProvider.generate({
      messages,
    });

  }

  async generateStream({
    provider,
    messages,
    onToken,
  }) {

    const aiProvider = getProvider(
      provider ?? DEFAULT_PROVIDER,
    );

    return aiProvider.generateStream({
      messages,
      onToken,
    });

  }

}

export default new GenerationService();