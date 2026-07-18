const schema = {
  bankName: null,
  accountHolder: null,
  accountNumber: null,
  statementPeriod: null,
  openingBalance: null,
  closingBalance: null,
  currency: null,
  transactions: [],
};

const instructions = `
Extract bank statement information.

Preserve transaction order.

Return null for missing fields.
`.trim();

export default {
  type: 'bank',
  schema,
  instructions,
};
