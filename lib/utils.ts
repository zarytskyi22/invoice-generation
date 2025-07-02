import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCurrencySymbol = (currency: "USD" | "EUR" | "USDT") => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "USDT":
      return "₮";
    default:
      return "$";
  }
};
