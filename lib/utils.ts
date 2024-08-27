import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  let hours = JSON.stringify(date.getHours());
  let minutes = JSON.stringify(date.getMinutes());

  if (+hours < 10) {
    hours = `0${hours}`;
  }
  if (+minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}
