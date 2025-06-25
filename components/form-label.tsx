import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, HTMLInputTypeAttribute } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import ErrorMessage from "./error-message";
import { Input, InputProps } from "./ui/input";
import { Label } from "./ui/label";

type FormLabelProps<T extends FieldValues> =
  ComponentPropsWithoutRef<"label"> & {
    formMethods: UseFormReturn<T>;
    name: Path<T>;
    label?: string;
    errorMessage?: string;
    inputClassName?: string;
    labelClass?: string;
    inputProps?: InputProps;
  };

export default function FormLabel<T extends FieldValues>({
  formMethods,
  name,
  label,
  errorMessage,
  className,
  inputClassName,
  labelClass,
  inputProps,
}: FormLabelProps<T>) {
  return (
    <Label className={cn("", label && "gap-1", className)}>
      {label && (
        <span className={cn("px-1 text-gray-500", labelClass)}>{label}</span>
      )}

      <Input
        type="text"
        {...formMethods.register(name)}
        {...inputProps}
        className={cn(inputClassName)}
      />
      <ErrorMessage message={errorMessage} />
    </Label>
  );
}
