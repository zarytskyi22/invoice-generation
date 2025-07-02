"use client";

import { cn, getCurrencySymbol } from "@/lib/utils";
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
import Divider from "../divider";
import { InvoiceData } from "./new-invoice-page";
import { defaultValues } from "./constants";

type NewInvoiceFormProps = ComponentPropsWithoutRef<"form"> & {
  createNewInvoice: (data: InvoiceData) => void;
};

// todo
// change invoice number + 1 on reset

export default function NewInvoiceForm({
  className,
  createNewInvoice,
}: NewInvoiceFormProps) {
  const [logo, setLogo] = useState<File | null>(null);

  // console.log(date ? date.toLocaleDateString("en-US") : "");

  const form = useForm<NewInvoiceFormValues>({
    resolver: zodResolver(NewInvoiceFormSchema),
    defaultValues,
  });

  const price = Number(form.watch("price"));
  const quantity = Number(form.watch("quantity"));
  const subtotal = price * quantity;
  const rateType = form.watch("rate_type");
  const discountPercent = Number(form.watch("discount_rate") || 0);
  const discountValue = (subtotal / 100) * Number(discountPercent);
  const taxPercent = Number(form.watch("tax_rate") || 0);
  const taxValue = ((subtotal - discountValue) / 100) * taxPercent;
  const total = subtotal - discountValue + taxValue;
  const symbol = getCurrencySymbol(form.watch("currency"));

  const onSubmit = (data: NewInvoiceFormValues) => {
    const result: InvoiceData = {
      ...data,
      logo,
      total_data: {
        subtotal,
        discountPercent,
        discountValue,
        taxPercent,
        taxValue,
        total,
        symbol,
      },
    };

    console.log("form-data", result);
    createNewInvoice(result);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("mt-5 flex gap-4", className)}
    >
      <div className="w-full flex flex-col gap-4">
        <div className="flex gap-4 flex-wrap justify-between">
          <div className="flex flex-col">
            <ImagePicker file={logo} setFile={setLogo} />

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
          />
          <FormLabel
            className="w-1/3"
            formMethods={form}
            name="price"
            label="Price:"
            errorMessage={form.formState.errors.price?.message}
            inputProps={{
              type: "number",
              placeholder: "(required)",
              min: 0,
              step: 0.01,
            }}
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
          name="discount_rate"
          label="Discount rate (%):"
          labelClass="text-nowrap"
          inputProps={{
            type: "number",
            placeholder: "0.00",
            step: 0.01,
            min: 0,
          }}
          formMethods={form}
          errorMessage={form.formState.errors.discount_rate?.message}
        />

        <FormLabel
          name="tax_rate"
          label={`${rateType} rate (%):`}
          inputProps={{
            type: "number",
            placeholder: "0.00",
            step: 0.01,
            min: 0,
          }}
          formMethods={form}
          errorMessage={form.formState.errors.tax_rate?.message}
        />

        <SubmitButton className="ml-[1px] mt-2 mb-[2px] w-[192px]">
          Generate
        </SubmitButton>

        <div className="font-medium [&>p]:flex [&>p]:justify-between">
          <p>
            Subtotal:{" "}
            <span className="font-normal">
              {subtotal.toFixed(2)}
              {symbol}
            </span>
          </p>

          <p>
            Discount:{" "}
            <span className="font-normal">
              ({discountPercent || 0}
              <span className="font-medium">%</span>) {discountValue.toFixed(2)}
              {symbol}
            </span>
          </p>

          <p>
            {rateType}:{" "}
            <span className="font-normal">
              ({taxPercent || 0}
              <span className="font-medium">%</span>) {taxValue.toFixed(2)}
              {symbol}
            </span>
          </p>

          <Divider className="my-1" />

          <p>
            Total:{" "}
            <span className="font-normal">
              {total.toFixed(2)}
              {symbol}
            </span>
          </p>
        </div>
      </div>
    </form>
  );
}
