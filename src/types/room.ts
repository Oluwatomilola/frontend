/**
 * src/types/room.ts
 */
import type { User } from './user';

export interface Room {
  id: string;
  name: string;
  description?: string;
  isPrivate?: boolean;
  members: Pick<User, 'id' | 'name' | 'address'>[]; // minimal member info
  createdAt: number; // epoch milliseconds
  updatedAt?: number;
  topic?: string;
  meta?: Record<string, unknown>;
}
