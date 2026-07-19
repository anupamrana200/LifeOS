import { getProvider } from '../providers/provider.factory.js';
import { DEFAULT_PROVIDER } from '../providers/constants.js';

class GenerationService {

  async generate({
    provider,
    model,
    messages,
  }) {

    const aiProvider = getProvider(
      provider ?? DEFAULT_PROVIDER,
    );

    return aiProvider.generate({
      messages,
      model,
    });

  }

  async generateStream({
    provider,
    model,
    messages,
    onToken,
  }) {

    const aiProvider = getProvider(
      provider ?? DEFAULT_PROVIDER,
    );

    return aiProvider.generateStream({
      messages,
      model,
      onToken,
    });

  }

}

export default new GenerationService();
