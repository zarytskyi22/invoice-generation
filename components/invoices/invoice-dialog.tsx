import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoiceData } from "./new-invoice-page";
import InvoiceItem from "./InvoiceItem";
import Divider from "../divider";

type InvoiceDialogProps = {
  isOpen: boolean;
  closeDialog: () => void;
  invoiceData: InvoiceData | null;
};

export function InvoiceDialog({
  isOpen,
  closeDialog,
  invoiceData,
}: InvoiceDialogProps) {
  if (!invoiceData) return;

  const {
    invoice_date,
    due_date,
    invoice_number,
    invoice_from,
    invoice_to,
    item_name,
    po_number,
    pay_terms,
    quantity,
    price,
    total_data,
  } = invoiceData;

  const { subtotal, discountValue, taxValue, symbol, total } = total_data;

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      {/* <DialogTrigger>Open</DialogTrigger> */}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>INVOICE # {invoice_number}</DialogTitle>
          <div className="text-[16px]">
            <InvoiceItem
              label="Invoice Date:"
              value={invoice_date.toLocaleDateString("en-US")}
            />
            <InvoiceItem
              label="Due Date:"
              value={due_date ? due_date.toLocaleDateString("en-US") : ""}
            />
            <InvoiceItem label="PO Number:" value={po_number} />

            <InvoiceItem label="Pay Terms:" value={pay_terms} />

            <InvoiceItem label="Bill From:" value={invoice_from} />

            <InvoiceItem label="Bill To:" value={invoice_to} />

            <Divider className="my-1" />

            <InvoiceItem
              className="font-semibold"
              label="ITEM:"
              value={item_name}
            />

            <Divider className="my-1" />

            <div className="flex gap-2 justify-between">
              <div className="w-1/2">
                <InvoiceItem
                  className="font-semibold"
                  label="QTY"
                  value={Number(quantity).toFixed(2)}
                />
                <InvoiceItem
                  className="font-semibold"
                  label="PRICE"
                  value={symbol + Number(price).toFixed(2)}
                />
                <InvoiceItem
                  className="font-semibold"
                  label="AMOUNT"
                  value={symbol + (Number(quantity) * Number(price)).toFixed(2)}
                />
              </div>

              <div className="w-1/2">
                <InvoiceItem
                  className="font-semibold"
                  label="SUBTOTAL:"
                  value={symbol + subtotal.toFixed(2)}
                />
                <InvoiceItem
                  className="font-semibold"
                  label="DISCOUNT:"
                  value={symbol + discountValue.toFixed(2)}
                />
                <InvoiceItem
                  className="font-semibold"
                  label="TAX:"
                  value={symbol + taxValue.toFixed(2)}
                />
              </div>
            </div>

            <Divider className="my-1" />

            <InvoiceItem label="Total:" value={symbol + total.toFixed(2)} />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
