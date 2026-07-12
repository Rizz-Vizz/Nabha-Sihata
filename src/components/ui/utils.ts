import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge@3.3.1";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}