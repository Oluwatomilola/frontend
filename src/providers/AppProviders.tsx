'use client';

import React, { ReactNode, useCallback, useEffect } from 'react';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TransactionProvider } from '@/context/TransactionContext';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle network changes
  useEffect(() => {
    const handleChainChanged = (chainId: string) => {
      console.log('Chain changed:', chainId);
      // Refresh the page when the network changes
      router.refresh();
    };

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [router]);

  // Error boundary reset when route changes
  const errorBoundaryKey = useCallback(() => {
    return `${pathname}?${searchParams?.toString()}`;
  }, [pathname, searchParams]);

  return (
    <ErrorBoundary key={errorBoundaryKey()}>
      <TransactionProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast: 'w-full max-w-sm rounded-lg border p-4 shadow-lg',
              title: 'text-sm font-medium',
              description: 'text-sm opacity-90',
              success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800',
              error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800',
              warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800',
              info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800',
              loading: 'bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-800/20 dark:text-slate-200 dark:border-slate-700',
            },
          }}
        />
      </TransactionProvider>
    </ErrorBoundary>
  );
}
