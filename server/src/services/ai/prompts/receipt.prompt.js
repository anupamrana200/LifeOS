const schema = {
  merchant: null,
  receiptNumber: null,
  purchaseDate: null,
  purchaseTime: null,
  items: [],
  subtotal: null,
  tax: null,
  discount: null,
  totalAmount: null,
  currency: null,
  paymentMethod: null,
};

const instructions = `
Extract receipt information.

Keep purchased items exactly as written.

Return null for unavailable fields.
`.trim();

export default {
  type: 'receipt',
  schema,
  instructions,
};
