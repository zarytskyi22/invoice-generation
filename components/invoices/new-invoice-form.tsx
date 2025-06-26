"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentPropsWithoutRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormLabel from "../form-label";
import { SubmitButton } from "../submit-button";
import ImagePicker from "../image-picker";
import { DatePicker } from "../ui/date-picker";
import { DropdownRadio } from "../ui/dropdown-radio";
import {
  NewInvoiceFormSchema,
  NewInvoiceFormValues,
} from "@/lib/schemas/invoices";

type NewInvoiceFormProps = ComponentPropsWithoutRef<"form"> & {};

const defaultValues: NewInvoiceFormValues = {
  invoice_date: new Date(),
  due_date: null,
  invoice_number: "1",
  pay_terms: null,
  po_number: null,
  rate_type: "Tax",
  rate: undefined,
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

// todo
// change invoice number + 1 on reset

export default function NewInvoiceForm({ className }: NewInvoiceFormProps) {
  const [logo, setLogo] = useState<File | null>(null);

  // console.log(date ? date.toLocaleDateString("en-US") : "");

  const form = useForm<NewInvoiceFormValues>({
    resolver: zodResolver(NewInvoiceFormSchema),
    defaultValues,
  });

  const onSubmit = (data: NewInvoiceFormValues) => {
    console.log("form data", data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("mt-5 flex gap-4", className)}
    >
      <div className="w-full flex flex-col gap-4">
        <div className="flex gap-4 flex-wrap justify-between">
          <div className="flex flex-col">
            <ImagePicker className="" file={logo} setFile={setLogo} />

            <div className="flex flex-col mt-2 gap-2">
              <Controller
                control={form.control}
                name="invoice_date"
                render={({ field }) => (
                  <DatePicker
                    label="Invoice Date"
                    date={field.value}
                    setDate={(date) => field.onChange(date)}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <DatePicker
                    label="Due Date"
                    date={field.value ? field.value : undefined}
                    setDate={(date) => field.onChange(date)}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FormLabel
              className="max-w-[192px]"
              formMethods={form}
              name="invoice_number"
              label="Invoice Number:"
              errorMessage={form.formState.errors.invoice_number?.message}
            />
            <FormLabel
              className="max-w-[192px]"
              formMethods={form}
              name="pay_terms"
              label="Pay Terms:"
              errorMessage={form.formState.errors.pay_terms?.message}
            />
            <FormLabel
              className="max-w-[192px]"
              formMethods={form}
              name="po_number"
              label="PO Number:"
              errorMessage={form.formState.errors.po_number?.message}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-between w-full">
          <FormLabel
            className="w-1/3"
            formMethods={form}
            name="item_name"
            label="Item name:"
            errorMessage={form.formState.errors.item_name?.message}
            inputProps={{ placeholder: "(required)" }}
          />{" "}
          <FormLabel
            className="w-1/3"
            inputProps={{
              type: "number",
              min: 1,
              step: "1",
              placeholder: "(required)",
            }}
            formMethods={form}
            name="quantity"
            label="Quantity:"
            errorMessage={form.formState.errors.quantity?.message}
          />{" "}
          <FormLabel
            className="w-1/3"
            formMethods={form}
            name="price"
            label="Price:"
            errorMessage={form.formState.errors.price?.message}
            inputProps={{ placeholder: "(required)" }}
          />
        </div>

        <div className="flex w-full gap-2">
          <FormLabel
            className="w-1/2"
            formMethods={form}
            name="invoice_from"
            label="Invoice from:"
            errorMessage={form.formState.errors.invoice_from?.message}
            inputProps={{ placeholder: "(required)" }}
          />
          <FormLabel
            className="w-1/2"
            formMethods={form}
            name="invoice_to"
            label="Invoice to:"
            errorMessage={form.formState.errors.invoice_to?.message}
            inputProps={{ placeholder: "(required)" }}
          />
        </div>

        <div className="flex w-full gap-2">
          <FormLabel
            className="w-1/2"
            formMethods={form}
            name="notes"
            label="Notes:"
            errorMessage={form.formState.errors.notes?.message}
            inputProps={{ placeholder: "Any relevant info" }}
          />
          <FormLabel
            className="w-1/2"
            formMethods={form}
            name="terms"
            label="Terms:"
            errorMessage={form.formState.errors.terms?.message}
            inputProps={{ placeholder: "Terms and conditions" }}
          />
        </div>
      </div>

      <div className="flex gap-2 flex-col">
        <div>
          <p className="text-[14px] font-medium text-gray-500">Currency</p>
          <div className="flex gap-1 mt-1">
            <Controller
              control={form.control}
              name="currency"
              render={({ field }) => (
                <DropdownRadio<"USD" | "EUR" | "USDT">
                  options={["USD", "EUR", "USDT"]}
                  position={field.value}
                  setPosition={(position) => field.onChange(position)}
                  className="w-full max-w-[192px] flex"
                />
              )}
            />
            <Controller
              control={form.control}
              name="rate_type"
              render={({ field }) => (
                <DropdownRadio<"Tax" | "VAT">
                  options={["Tax", "VAT"]}
                  position={field.value}
                  setPosition={(position) => field.onChange(position)}
                  className="w-full max-w-[192px] flex"
                />
              )}
            />
          </div>
        </div>

        <FormLabel
          inputProps={{
            type: "number",
            // min: 0,
            step: "0.01",
            placeholder: "0.00",
          }}
          formMethods={form}
          name="rate"
          label="Rate:"
          errorMessage={form.formState.errors.rate?.message}
        />
        <FormLabel
          labelClass="text-nowrap"
          inputProps={{
            type: "number",
            // min: 0,
            step: "0.01",
            placeholder: "0.00",
          }}
          formMethods={form}
          name="discount_rate"
          label="Discount rate:"
          errorMessage={form.formState.errors.discount_rate?.message}
        />
        <SubmitButton className="ml-[1px] mt-2 mb-[2px] w-[192px]">
          Generate
        </SubmitButton>
      </div>
    </form>
  );
}
