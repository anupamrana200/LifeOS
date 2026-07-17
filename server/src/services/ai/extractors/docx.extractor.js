
import mammoth from 'mammoth';

export const extractDocx = async ({ buffer }) => {
  const { value } = await mammoth.extractRawText({
    buffer,
  });

  return {
    text: value.trim(),
    metadata: {
      pageCount: null,
      title: null,
      author: null,
      language: null,
      isScanned: false,
    },
  };
};