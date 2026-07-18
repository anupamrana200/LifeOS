const schema = {
  invoiceNumber: null,
  invoiceDate: null,
  dueDate: null,
  vendorName: null,
  vendorAddress: null,
  customerName: null,
  customerAddress: null,
  subtotal: null,
  tax: null,
  discount: null,
  totalAmount: null,
  currency: null,
  paymentMethod: null,
  notes: null,
};

const instructions = `
Extract all invoice information.

Return monetary values exactly as written.

Return null for missing fields.

Do not calculate missing values.
`.trim();

export default {
  type: 'invoice',
  schema,
  instructions,
};
