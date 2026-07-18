const schema = {
  documentType: null,
  title: null,
  summary: null,
  entities: [],
  dates: [],
  amounts: [],
  keyValues: {},
  notes: null,
};

const instructions = `
Analyze the document and extract all important structured information.

Populate every field whenever possible.

If a field is unavailable, return null.

Do not invent information.
`.trim();

export default {
  type: 'generic',
  schema,
  instructions,
};
