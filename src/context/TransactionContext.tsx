import React, { createContext, useContext, useCallback, useMemo, ReactNode } from 'react';
import { useAccount, useSwitchChain, useChainId, usePublicClient, useWalletClient } from 'wagmi';
import { toast } from 'sonner';
import { Address, TransactionReceipt } from 'viem';
import { formatError, isUserRejectedError, isNetworkError, isGasEstimationError } from '@/lib/utils';

type TransactionStatus = 'idle' | 'preparing' | 'waiting' | 'mining' | 'success' | 'error';

interface TransactionState {
  status: TransactionStatus;
  error: Error | null;
  receipt: TransactionReceipt | null;
  txHash: string | null;
}

interface TransactionOptions {
  pending?: string;
  success?: string;
  error?: string | ((error: Error) => string);
  onSuccess?: (receipt: TransactionReceipt) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
  showLoading?: boolean;
  confirmations?: number;
}

interface TransactionContextType {
  executeTransaction: <T = any>(
    fn: () => Promise<{ hash: Address }>,
    options?: TransactionOptions
  ) => Promise<{ success: boolean; error?: Error; receipt?: TransactionReceipt; data?: T }>;
  switchNetwork: (chainId: number) => Promise<boolean>;
  state: TransactionState;
  clearError: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = React.useState<TransactionState>({
    status: 'idle',
    error: null,
    receipt: null,
    txHash: null,
  });

  const { chain: currentChain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const switchNetwork = useCallback(async (targetChainId: number): Promise<boolean> => {
    if (chainId === targetChainId) return true;

    try {
      if (!switchChainAsync) {
        if (!walletClient) {
          throw new Error('No wallet client available');
        }
        
        await walletClient.switchChain({ id: targetChainId });
        return true;
      }
      
      await switchChainAsync({ chainId: targetChainId });
      return true;
    } catch (error) {
      console.error('Failed to switch network:', error);
      
      if (isUserRejectedError(error)) {
        toast.error('Network switch was cancelled');
      } else {
        toast.error('Failed to switch network', {
          description: 'Please try again or switch manually in your wallet',
        });
      }
      
      return false;
    }
  }, [chainId, switchChainAsync, walletClient]);

  const executeTransaction = useCallback(
    async <T = any>(
      fn: () => Promise<{ hash: Address }>,
      options: TransactionOptions = {}
    ): Promise<{ success: boolean; error?: Error; receipt?: TransactionReceipt; data?: T }> => {
      const {
        pending = 'Please confirm the transaction in your wallet',
        success = 'Transaction confirmed!',
        error: errorMessage = 'Transaction failed',
        onSuccess,
        onError,
        showToast = true,
        showLoading = true,
        confirmations = 1,
      } = options;

      setState({ status: 'preparing', error: null, receipt: null, txHash: null });
      let toastId: string | number | undefined;

      try {
        if (showToast) {
          toastId = toast.loading(pending, { duration: Infinity });
        }
        if (showLoading) {
          setState(prev => ({ ...prev, status: 'preparing' }));
        }

        // Execute the transaction
        const result = await fn();
        
        if (showLoading) {
          setState(prev => ({ ...prev, status: 'waiting', txHash: result.hash }));
        }

        if (!publicClient) {
          throw new Error('No public client available');
        }
        
        // Wait for transaction receipt
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: result.hash,
          confirmations,
        });

        // Update state
        if (showLoading) {
          setState({
            status: 'success',
            error: null,
            receipt,
            txHash: result.hash,
          });
        }

        // Show success toast
        if (showToast) {
          const successMessage = typeof success === 'function' ? success : (() => success);
          toast.success(successMessage(), { id: toastId });
        }
        
        // Call success callback
        if (onSuccess) {
          onSuccess(receipt);
        }

        return { success: true, receipt, data: receipt as unknown as T };
      } catch (error) {
        const err = error as Error;
        console.error('Transaction error:', err);
        
        // Don't show toast for user rejected errors
        const isRejected = isUserRejectedError(err);
        const isNetworkErr = isNetworkError(err);
        const isGasError = isGasEstimationError(err);
        
        // Format error message
        const errorMsg = typeof errorMessage === 'function' 
          ? errorMessage(err) 
          : errorMessage;
        
        const errorDescription = formatError(err);
        
        if (showLoading) {
          setState(prev => ({
            ...prev,
            status: 'error',
            error: err,
          }));
        }

        // Show error toast if not a user rejection
        if (showToast && !isRejected) {
          toast.error(errorMsg, {
            description: errorDescription,
            id: toastId,
            duration: isNetworkErr || isGasError ? 10000 : 5000,
          });
        } else if (showToast && toastId) {
          toast.dismiss(toastId);
        }
        
        // Call error callback
        if (onError) {
          onError(err);
        }

        return {
          success: false,
          error: err,
        };
      }
    },
    [currentChain]
  );

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      status: 'idle',
    }));
  }, []);

  const value = useMemo(
    () => ({
      executeTransaction,
      switchNetwork,
      state,
      clearError,
    }),
    [executeTransaction, switchNetwork, state, clearError]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
}
