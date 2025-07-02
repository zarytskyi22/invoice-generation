import { NewInvoiceFormValues } from "@/lib/schemas/invoices";

export const defaultValues: NewInvoiceFormValues = {
  invoice_date: new Date(),
  due_date: null,
  invoice_number: "1",
  pay_terms: null,
  po_number: null,
  rate_type: "Tax",
  tax_rate: undefined,
  discount_rate: undefined,
  currency: "USD",
  invoice_from: "",
  invoice_to: "",
  item_name: "",
  quantity: "1",
  price: "1",
  notes: "",
  terms: "",
};
