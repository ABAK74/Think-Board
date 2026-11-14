import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Note, NotePayload } from '../../types/note';
import {
  MIN_NOTE_CONTENT_LENGTH,
  noteSchema,
} from '../../utils/noteValidation';
import { X, Loader2 } from 'lucide-react';

interface EditNoteModalProps {
  note: Note | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSave: (id: string, payload: NotePayload) => Promise<boolean>;
}

export const EditNoteModal: React.FC<EditNoteModalProps> = ({
  note,
  isSubmitting,
  onClose,
  onSave,
}) => {
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

  useEffect(() => {
    if (note) {
      reset({ title: note.title, content: note.content });
    }
  }, [note, reset]);

  if (!note) return null;

  const onSubmit = async (payload: NotePayload) => {
    const success = await onSave(note.id, payload);
    if (success) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1e2229] border border-[#323842] rounded-lg max-w-lg w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
          <h2 className="text-lg font-bold text-white">Edit Note</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label htmlFor="edit-note-title" className="block text-xs font-medium text-gray-400 mb-1">
              Note Title
            </label>
            <input
              id="edit-note-title"
              type="text"
              {...register('title')}
              required
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'edit-note-title-error' : undefined}
              disabled={isBusy}
              className="w-full px-3.5 py-2 bg-[#14171c] border border-[#323842] rounded-md text-sm text-gray-100 focus:outline-none focus:border-[#6366f1]"
            />
            {errors.title && (
              <p id="edit-note-title-error" role="alert" className="mt-1 text-xs text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="edit-note-content" className="block text-xs font-medium text-gray-400 mb-1">
              Note Content
            </label>
            <textarea
              id="edit-note-content"
              rows={5}
              {...register('content')}
              required
              minLength={MIN_NOTE_CONTENT_LENGTH}
              aria-invalid={Boolean(errors.content)}
              aria-describedby={`edit-note-content-hint${errors.content ? ' edit-note-content-error' : ''}`}
              disabled={isBusy}
              className="w-full px-3.5 py-2 bg-[#14171c] border border-[#323842] rounded-md text-sm text-gray-100 focus:outline-none focus:border-[#6366f1] resize-y"
            />
            <p id="edit-note-content-hint" className="mt-1 text-[11px] text-gray-500">
              Minimum {MIN_NOTE_CONTENT_LENGTH} characters
            </p>
            {errors.content && (
              <p id="edit-note-content-error" role="alert" className="mt-1 text-xs text-red-400">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="px-4 py-2 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#6366f1] hover:bg-[#5254e8] text-white rounded-md transition-colors disabled:opacity-60"
            >
              {isBusy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
