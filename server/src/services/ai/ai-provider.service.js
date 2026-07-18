import {
  getProvider,
} from './providers/provider.factory.js';

export const generateContent = async ({
  modelProvider,
  model,
  prompt,
}) => {
  const provider = getProvider(modelProvider);

  return provider.generate({
    model,

    system: prompt.system,

    user: prompt.user,
  });
};