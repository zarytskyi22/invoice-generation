"use client";

import CreateForm from "@/components/invoices/new-invoice-form";
import PageTitle from "@/components/page-title";
import { InvoiceDialog } from "./invoice-dialog";
import { useState } from "react";
import { NewInvoiceFormValues } from "@/lib/schemas/invoices";

type NewInvoicePageProps = {};

export type InvoiceData = NewInvoiceFormValues & {
  logo: File | null;
  total_data: {
    subtotal: number;
    discountPercent: number;
    discountValue: number;
    taxPercent: number;
    taxValue: number;
    total: number;
    symbol: string;
  };
};

export default function NewInvoicePage({}: NewInvoicePageProps) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const handleNewInvoice = (data: InvoiceData) => {
    setInvoiceData(data);
  };

  const handleCloseDialog = () => {
    setInvoiceData(null);
  };

  return (
    <div>
      <PageTitle>New invoice</PageTitle>
      <CreateForm createNewInvoice={handleNewInvoice} />
      <InvoiceDialog
        invoiceData={invoiceData}
        closeDialog={handleCloseDialog}
        isOpen={!!invoiceData}
      />
    </div>
  );
}
