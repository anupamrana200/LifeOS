
export const buildDocumentSummaryPrompt = ({ documentText }) => {
  return `
You are an expert document analysis assistant.

Your task is to read the document below and generate a concise, accurate summary.

Requirements:
- Keep the summary under 250 words.
- Preserve important facts.
- Do not invent information.
- Ignore repeated content.
- Return plain text only.
- Do not use markdown.

DOCUMENT:
"""
${documentText}
"""
`;
};