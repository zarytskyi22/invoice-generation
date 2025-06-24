import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type FormLabelProps<T extends FieldValues> =
  ComponentPropsWithoutRef<"label"> & {
    formMethods: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    errorMessage?: string;
  };

export default function FormLabel<T extends FieldValues>({
  formMethods,
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
        {...formMethods.register(name)}
        className="mt-1 w-full p-2 border rounded"
      />
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </label>
  );
}
