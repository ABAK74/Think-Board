import React, { useState, useEffect } from 'react';
import { Note, NotePayload } from '../../types/note';
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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setError(null);
    }
  }, [note]);

  if (!note) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required.');
      return;
    }
    const success = await onSave(note.id, { title, content });
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Note Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2 bg-[#14171c] border border-[#323842] rounded-md text-sm text-gray-100 focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Note Content
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2 bg-[#14171c] border border-[#323842] rounded-md text-sm text-gray-100 focus:outline-none focus:border-[#6366f1] resize-y"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#6366f1] hover:bg-[#5254e8] text-white rounded-md transition-colors disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
