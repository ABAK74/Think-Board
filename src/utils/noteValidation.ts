import { NotePayload } from '../types/note';

export const MIN_NOTE_CONTENT_LENGTH = 10;

export const normalizeNotePayload = (payload: NotePayload): NotePayload => ({
  title: payload.title.trim(),
  content: payload.content.trim(),
});

export const getNoteValidationError = (payload: NotePayload): string | null => {
  const normalized = normalizeNotePayload(payload);

  if (!normalized.title || !normalized.content) {
    return 'Please enter both a note title and content.';
  }

  if (normalized.content.length < MIN_NOTE_CONTENT_LENGTH) {
    return `Note content must be at least ${MIN_NOTE_CONTENT_LENGTH} characters.`;
  }

  return null;
};
