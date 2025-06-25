"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentPropsWithoutRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormLabel from "../form-label";
import { SubmitButton } from "../submit-button";
import ImagePicker from "../image-picker";
import { DatePicker } from "../ui/date-picker";
import { DropdownRadio } from "../ui/dropdown-radio";

type NewInvoiceFormProps = ComponentPropsWithoutRef<"form"> & {};

const NewInvoiceFormSchema = z.object({
  invoice_date: z.string(),
  due_date: z.string().nullable(),
  invoice_number: z.string(),
  pay_terms: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Pay Terms must be a number",
    })
    .nullable(),
  po_number: z.string().nullable(),
  rate_type: z.enum(["Tax", "VAT"]),
  rate: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Rate must be a number",
  }),
  discount_rate: z.string(),
  currency: z.enum(["USD", "EUR", "USDT"]),
  invoice_from: z
    .string()
    .min(2, "Min 2 characters")
    .max(25, "Max 25 characters"),
  invoice_to: z
    .string()
    .min(2, "Min 2 characters")
    .max(25, "Max 25 characters"),
  item_name: z.string(),
  quantity: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && Number.isInteger(num);
    },
    { message: "Quantity must be an integer" }
  ),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a number",
  }),
  notes: z.string().max(250, "Max 250 characters").nullable(),
  terms: z.string().max(250, "Max 250 characters").nullable(),
});

type NewInvoiceFormValues = z.infer<typeof NewInvoiceFormSchema>;

const defaultValues: NewInvoiceFormValues = {
  invoice_date: "",
  due_date: null,
  invoice_number: "1",
  pay_terms: null,
  po_number: null,
  rate_type: "Tax",
  rate: "0",
  discount_rate: "0",
  currency: "USD",
  invoice_from: "",
  invoice_to: "",
  item_name: "",
  quantity: "1",
  price: "0",
  notes: "",
  terms: "",
};

// todo
// change invoice number + 1 on reset

export default function NewInvoiceForm({ className }: NewInvoiceFormProps) {
  const [logo, setLogo] = useState<File | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(
    new Date(Date.now())
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [rateType, setRateType] = useState<"Tax" | "VAT">("Tax");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "USDT">("USD");

  // console.log(date ? date.toLocaleDateString("en-US") : "");

  const form = useForm<NewInvoiceFormValues>({
    resolver: zodResolver(NewInvoiceFormSchema),
    defaultValues,
  });

  const onSubmit = (data: NewInvoiceFormValues) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("mt-5", className)}
    >
      <div className="flex gap-4 flex-wrap justify-between">
        <ImagePicker file={logo} setFile={setLogo} />
        <div className="flex flex-col gap-4">
          <DatePicker
            label="Invoice Date"
            date={invoiceDate}
            setDate={setInvoiceDate}
          />
          <DatePicker label="Due Date" date={dueDate} setDate={setDueDate} />
          <SubmitButton className="ml-auto w-[190px]">Generate</SubmitButton>
        </div>
      </div>
      <FormLabel
        formMethods={form}
        name="invoice_number"
        label="Invoice Number:"
        errorMessage={form.formState.errors.invoice_number?.message}
      />
      <FormLabel
        formMethods={form}
        name="pay_terms"
        label="Pay Terms:"
        errorMessage={form.formState.errors.pay_terms?.message}
      />{" "}
      <FormLabel
        formMethods={form}
        name="po_number"
        label="PO Number:"
        errorMessage={form.formState.errors.po_number?.message}
      />
      <div className="flex gap-2">
        <DropdownRadio<"USD" | "EUR" | "USDT">
          options={["USD", "EUR", "USDT"]}
          position={currency}
          setPosition={setCurrency}
          className="w-[80px] flex"
        />
        <DropdownRadio<"Tax" | "VAT">
          options={["Tax", "VAT"]}
          position={rateType}
          setPosition={setRateType}
          className="w-[80px]"
        />
        <FormLabel
          className="flex flex-row items-center"
          inputProps={{ type: "number", min: 0 }}
          formMethods={form}
          name="rate"
          label="Rate:"
          errorMessage={form.formState.errors.rate?.message}
        />
        <FormLabel
          className="flex flex-row items-center"
          labelClass="text-nowrap"
          inputProps={{ type: "number", min: 0 }}
          formMethods={form}
          name="discount_rate"
          label="Discount rate:"
          errorMessage={form.formState.errors.discount_rate?.message}
        />
      </div>
      <FormLabel
        formMethods={form}
        name="invoice_from"
        label="Invoice from:"
        errorMessage={form.formState.errors.invoice_from?.message}
      />
      <FormLabel
        formMethods={form}
        name="invoice_to"
        label="Invoice to:"
        errorMessage={form.formState.errors.invoice_to?.message}
      />
      <FormLabel
        formMethods={form}
        name="item_name"
        label="Item name:"
        errorMessage={form.formState.errors.item_name?.message}
      />{" "}
      <FormLabel
        formMethods={form}
        name="quantity"
        label="Quantity:"
        errorMessage={form.formState.errors.quantity?.message}
      />{" "}
      <FormLabel
        formMethods={form}
        name="price"
        label="Price:"
        errorMessage={form.formState.errors.price?.message}
      />
      <FormLabel
        formMethods={form}
        name="notes"
        label="Notes:"
        errorMessage={form.formState.errors.notes?.message}
      />
      <FormLabel
        formMethods={form}
        name="terms"
        label="Terms:"
        errorMessage={form.formState.errors.terms?.message}
      />
    </form>
  );
}
