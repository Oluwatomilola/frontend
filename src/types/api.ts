/**
 * src/types/api.ts
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

export interface Pagination {
  page: number;
  perPage: number;
  total?: number;
  totalPages?: number;
}

export interface ApiError {
  code: string | number;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError | null;
  meta?: {
    requestId?: string;
    timestamp?: number;
    pagination?: Pagination;
    [k: string]: unknown;
  };
}

/**
 * Example typed endpoints container. You can extend this with real endpoints.
 */
export interface Endpoints {
  getMessages?: {
    method: 'GET';
    path: '/messages';
    response: ApiResponse<{ messages: unknown[] }>;
    query?: { roomId?: string; limit?: number; page?: number };
  };
  sendMessage?: {
    method: 'POST';
    path: '/messages';
    body: { roomId: string; content: string; sender: string };
    response: ApiResponse<{ messageId: string }>;
  };
}
