import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, start = 6, end = 4) {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    // Handle common Ethereum error messages
    const message = error.message.toLowerCase();
    
    if (message.includes('user rejected')) {
      return 'Transaction was rejected by user';
    }
    
    if (message.includes('insufficient funds')) {
      return 'Insufficient funds for transaction';
    }
    
    if (message.includes('gas required exceeds allowance')) {
      return 'Insufficient balance for gas';
    }
    
    if (message.includes('network mismatch')) {
      return 'Please switch to the correct network';
    }
    
    // Return the error message with first letter capitalized
    return error.message.charAt(0).toUpperCase() + error.message.slice(1);
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}

export function isUserRejectedError(error: unknown): boolean {
  if (!error) return false;
  
  const message = error instanceof Error 
    ? error.message.toLowerCase() 
    : String(error).toLowerCase();
    
  return (
    message.includes('user rejected') ||
    message.includes('user denied') ||
    message.includes('user cancelled') ||
    message.includes('request rejected') ||
    message.includes('rejected by user') ||
    message.includes('user rejected request')
  );
}

export function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  
  const message = error instanceof Error 
    ? error.message.toLowerCase() 
    : String(error).toLowerCase();
    
  return (
    message.includes('network changed') ||
    message.includes('network mismatch') ||
    message.includes('wrong network') ||
    message.includes('unsupported chain') ||
    message.includes('chain not configured')
  );
}

export function isGasEstimationError(error: unknown): boolean {
  if (!error) return false;
  
  const message = error instanceof Error 
    ? error.message.toLowerCase() 
    : String(error).toLowerCase();
    
  return (
    message.includes('gas required exceeds allowance') ||
    message.includes('gas required exceeds limit') ||
    message.includes('intrinsic gas too low') ||
    message.includes('out of gas') ||
    message.includes('gas estimation failed')
  );
}
