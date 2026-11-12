export interface Note {
  id: string;
  _id?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotePayload {
  title: string;
  content: string;
}

export type SortOption = 'newest' | 'oldest' | 'updated' | 'alphabetical';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

export interface ApiConfig {
  baseUrl: string;
  useMockFallback: boolean;
}
