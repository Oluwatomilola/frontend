/**
 * src/types/message.ts
 */
import type { Address } from './index';
import type { User } from './user';

export interface Message {
  id: string;
  sender: Address | User; // allow either a simple Address or a User object
  content: string;
  timestamp: number; // epoch milliseconds
  roomId: string;
  edited?: boolean;
  deleted?: boolean;
  meta?: Record<string, unknown>; // extensible metadata
}
