export function buildRetrievalPrompt({
  question,
  history,
  contexts,
}) {
  return `
Conversation History:

${history}

--------------------------

Document Context:

${contexts.join('\n\n')}

--------------------------

Current User Question:

${question}

Answer ONLY using the document context.

If the answer cannot be found, say you couldn't find that information.
`;
}