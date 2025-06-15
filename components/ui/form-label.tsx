import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import {
  FieldValues,
  Path,
  UseFormRegister,
  UseFormReturn,
} from "react-hook-form";

type FormLabelProps<T extends FieldValues> =
  ComponentPropsWithoutRef<"label"> & {
    form: UseFormReturn;
    name: keyof T;
    label: string;
    errorMessage?: string;
    register: UseFormRegister<FieldValues>;
  };

export default function FormLabel<T extends FieldValues>({
  form,
  name,
  label,
  errorMessage,
  className,
}: FormLabelProps<T>) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm text-gray-600">{label}</span>

      <input
        type="text"
        {...form.register(name as Path<T>)}
        className="mt-1 w-full p-2 border rounded"
      />
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </label>
  );
}
