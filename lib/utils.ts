import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function getBloodGroupColor(bloodGroup: string) {
  switch (bloodGroup) {
    case 'O-': return 'bg-brand text-white';
    case 'O+': return 'bg-brand/80 text-white';
    case 'A-': return 'bg-accent text-white';
    case 'A+': return 'bg-accent/80 text-white';
    case 'B-': return 'bg-warning text-white';
    case 'B+': return 'bg-warning/80 text-white';
    case 'AB-': return 'bg-success text-white';
    case 'AB+': return 'bg-success/80 text-white';
    default: return 'bg-neutral-500 text-white';
  }
}
