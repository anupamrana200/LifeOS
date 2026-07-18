const schema = {
  documentName: null,
  documentNumber: null,
  fullName: null,
  dateOfBirth: null,
  gender: null,
  nationality: null,
  address: null,
  issueDate: null,
  expiryDate: null,
};

const instructions = `
Extract identity document information.

Never infer values.

Return null when unavailable.
`.trim();

export default {
  type: 'identity',
  schema,
  instructions,
};
