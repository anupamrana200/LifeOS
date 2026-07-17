
export const extractTxt = async ({ buffer }) => {
  const text = buffer.toString('utf-8').trim();

  return {
    text,
    metadata: {
      pageCount: 1,
      title: null,
      author: null,
      language: null,
      isScanned: false,
    },
  };
};