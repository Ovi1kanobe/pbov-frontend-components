import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDateForPocketbase(date: Date) {
  const formatted = date.toISOString().replace("T", " ");
  return formatted;
}

export const formatOrdinal = (value: string) => {
  const date = new Date(value);
  const day = date.getUTCDate();
  const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
  const suffixes = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
  return `${day}${suffixes[pr.select(day) as keyof typeof suffixes]}`;
};

export const addOrdinalSuffix = (num: number) => {
  const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
  const suffixes = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
  return `${num}${suffixes[pr.select(num) as keyof typeof suffixes]}`;
};

export const intToMonth = (month: number | string) => {
  const date = new Date();
  date.setMonth(Number(month) - 1);
  return date.toLocaleString('default', { month: 'long' });
};

/**
 * Rounds hours to the nearest 0.25 hour (15 minutes)
 */
export function roundToNearestQuarter(hours: number): number {
  return Math.round(hours * 4) / 4;
}

/**
 * Formats time string to display format in UTC (e.g., "12:00pm")
 * Handles both formats: "12:30:00.000Z" and "2025-08-29 10:30:00.000Z"
 */
export function formatTimeDisplay(timeString: string): string {
  if (!timeString) return "";
  
  let date: Date;
  
  // Check if it's just a time (HH:MM:SS.sssZ format)
  if (timeString.match(/^\d{2}:\d{2}:\d{2}\.\d{3}Z?$/)) {
    // Create a date with today's date and the provided time
    const today = new Date().toISOString().split('T')[0];
    date = new Date(`${today}T${timeString}`);
  } else {
    // It's a full datetime string
    date = new Date(timeString);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return timeString; // Return original if parsing fails
  }
  
  // Format to 12-hour time with am/pm in UTC
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  }).toLowerCase();
}