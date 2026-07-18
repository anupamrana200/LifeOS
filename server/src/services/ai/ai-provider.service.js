import { getProvider } from './providers/provider.factory.js';

export const generateContent = async ({
  modelProvider,
  model,
  prompt,
}) => {
  const provider = getProvider(modelProvider);

  return provider.generate({
    model,
    messages: [
      {
        role: 'system',
        content: prompt.system,
      },
      {
        role: 'user',
        content: prompt.user,
      },
    ],
  });
};