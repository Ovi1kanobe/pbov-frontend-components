import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
export declare function formatDateForPocketbase(date: Date): string;
export declare const formatOrdinal: (value: string) => string;
export declare const addOrdinalSuffix: (num: number) => string;
export declare const intToMonth: (month: number | string) => string;
/**
 * Rounds hours to the nearest 0.25 hour (15 minutes)
 */
export declare function roundToNearestQuarter(hours: number): number;
/**
 * Formats time string to display format in UTC (e.g., "12:00pm")
 * Handles both formats: "12:30:00.000Z" and "2025-08-29 10:30:00.000Z"
 */
export declare function formatTimeDisplay(timeString: string): string;
