import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NotePayload } from '../types/note';
import {
  MIN_NOTE_CONTENT_LENGTH,
  noteSchema,
} from '../utils/noteValidation';
import { Loader2 } from 'lucide-react';

interface NoteFormProps {
  onCreateNote: (payload: NotePayload) => Promise<boolean>;
  isSubmitting: boolean;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onCreateNote, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<NotePayload>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: '', content: '' },
  });
  const isBusy = isSubmitting || isFormSubmitting;

  const onSubmit = async (payload: NotePayload) => {
    const success = await onCreateNote(payload);
    if (success) reset();
  };

  return (
    <section aria-label="Create a new note" className="mb-10">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="create-note-title" className="sr-only">Note Title</label>
          <input
            id="create-note-title"
            type="text"
            placeholder="Enter your note title here"
            {...register('title')}
            required
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'create-note-title-error' : undefined}
            disabled={isBusy}
            className="w-full px-3.5 py-2.5 bg-[#1e2229] border border-[#323842] rounded-md text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors disabled:opacity-60"
          />
          {errors.title && (
            <p id="create-note-title-error" role="alert" className="mt-1 text-xs text-red-400 font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="create-note-content" className="sr-only">Note Content</label>
          <textarea
            id="create-note-content"
            rows={4}
            placeholder="Enter your note content here"
            {...register('content')}
            required
            minLength={MIN_NOTE_CONTENT_LENGTH}
            aria-invalid={Boolean(errors.content)}
            aria-describedby={`create-note-content-hint${errors.content ? ' create-note-content-error' : ''}`}
            disabled={isBusy}
            className="w-full px-3.5 py-2.5 bg-[#1e2229] border border-[#323842] rounded-md text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors resize-y disabled:opacity-60"
          />
          <p id="create-note-content-hint" className="mt-1 text-[11px] text-gray-500">
            Minimum {MIN_NOTE_CONTENT_LENGTH} characters
          </p>
          {errors.content && (
            <p id="create-note-content-error" role="alert" className="mt-1 text-xs text-red-400 font-medium">
              {errors.content.message}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6366f1] hover:bg-[#5254e8] active:bg-[#4648d6] text-white text-xs sm:text-sm font-semibold rounded-md shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isBusy && <Loader2 className="w-4 h-4 animate-spin" />}
            Create new note
          </button>
        </div>
      </form>
    </section>
  );
};
