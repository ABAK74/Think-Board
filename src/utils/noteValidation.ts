import { z } from 'zod';

export const MIN_NOTE_CONTENT_LENGTH = 10;

export const noteSchema = z.object({
  title: z.string().trim().min(1, 'Please enter a note title.'),
  content: z.string().trim().min(
    MIN_NOTE_CONTENT_LENGTH,
    `Note content must be at least ${MIN_NOTE_CONTENT_LENGTH} characters.`,
  ),
});
