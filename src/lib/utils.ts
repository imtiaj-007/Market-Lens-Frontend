import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values into a single string using clsx and tailwind-merge.
 * This allows for conditional and dynamic class names with proper Tailwind CSS conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Theme colors for dashboard elements
 */
export const themeColors = {
  blue: {
    border: 'border-t-blue-500',
    icon: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-600 dark:text-blue-400',
    border2: 'border-blue-200 dark:border-blue-900',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/70',
  },
  purple: {
    border: 'border-t-purple-500',
    icon: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950',
    text: 'text-purple-600 dark:text-purple-400',
    border2: 'border-purple-200 dark:border-purple-900',
    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/70',
  },
  amber: {
    border: 'border-t-amber-500',
    icon: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950',
    text: 'text-amber-600 dark:text-amber-400',
    border2: 'border-amber-200 dark:border-amber-900',
    hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/70',
  },
  green: {
    border: 'border-t-green-500',
    icon: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-600 dark:text-green-400',
    border2: 'border-green-200 dark:border-green-900',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900/70',
  },
  red: {
    border: 'border-t-red-500',
    icon: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-600 dark:text-red-400',
    border2: 'border-red-200 dark:border-red-900',
    hover: 'hover:bg-red-100 dark:hover:bg-red-900/70',
  },
  indigo: {
    border: 'border-t-indigo-500',
    icon: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950',
    text: 'text-indigo-600 dark:text-indigo-400',
    border2: 'border-indigo-200 dark:border-indigo-900',
    hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/70',
  },
};

/**
 * Format a number to a human-readable string with K, M, B suffixes
 */
export function formatNumber(value: number): string {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B';
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
}

/**
 * Format currency with proper symbol and decimal places
 */
export function formatCurrency(
  value: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return value.toFixed(decimals) + '%';
}

/**
 * Format date to human-readable string
 */
export function formatDate(date: Date | string, format: string = 'medium'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {};
  
  switch (format) {
    case 'short':
      options.day = 'numeric';
      options.month = 'short';
      break;
    case 'medium':
      options.day = 'numeric';
      options.month = 'short';
      options.year = 'numeric';
      break;
    case 'long':
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      break;
    case 'time':
      options.hour = 'numeric';
      options.minute = 'numeric';
      break;
    case 'datetime':
      options.day = 'numeric';
      options.month = 'short';
      options.year = 'numeric';
      options.hour = 'numeric';
      options.minute = 'numeric';
      break;
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(d);
}
