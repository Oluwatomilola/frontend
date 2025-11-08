/**
 * src/types/user.ts
 */
import type { Address } from './index';

export interface User {
  id: string;
  name: string;
  address: Address;
  email?: string;
  avatarUrl?: string;
  role?: 'admin' | 'moderator' | 'member' | 'guest';
  createdAt: number; // epoch milliseconds
  bio?: string;
  meta?: Record<string, unknown>;
}
