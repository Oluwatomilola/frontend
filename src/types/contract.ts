/**
 * src/types/contract.ts
 */
import type { Address } from './index';

export type AbiItem = {
  name?: string;
  type?: string;
  inputs?: unknown[];
  outputs?: unknown[];
  stateMutability?: string;
  [k: string]: unknown;
};

export interface Contract {
  address: Address;
  name?: string;
  network?: string; // e.g. "base", "mainnet", "goerli"
  abi?: AbiItem[]; // loosely typed ABI items
  methods?: string[]; // list of method names for quick reference
  verified?: boolean;
  deployedAt?: number; // epoch milliseconds
  meta?: Record<string, unknown>;
}
