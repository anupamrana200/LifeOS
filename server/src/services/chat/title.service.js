import { getProvider } from '../ai/providers/provider.factory.js';
import { DEFAULT_PROVIDER } from '../ai/providers/constants.js';

class TitleService {

  async generate({
    message,
    provider,
  }) {

    const aiProvider =
      getProvider(provider ?? DEFAULT_PROVIDER);

    const response =
      await aiProvider.generate({
        messages: [
          {
            role: 'system',
            content:
              `Generate a very short chat title.

Rules:
- Maximum 6 words.
- No quotation marks.
- No punctuation at the end.
- Return ONLY the title.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
      });

    return response.text.trim();
  }

}

export default new TitleService();