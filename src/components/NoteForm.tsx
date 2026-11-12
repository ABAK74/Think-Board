import React, { useState } from 'react';
import { NotePayload } from '../types/note';
import { Loader2 } from 'lucide-react';

interface NoteFormProps {
  onCreateNote: (payload: NotePayload) => Promise<boolean>;
  isSubmitting: boolean;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onCreateNote, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setValidationError('Please enter both a note title and content.');
      return;
    }
    setValidationError(null);
    const success = await onCreateNote({ title, content });
    if (success) {
      setTitle('');
      setContent('');
    }
  };

  return (
    <section aria-label="Create a new note" className="mb-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter your note title here"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError(null);
            }}
            disabled={isSubmitting}
            className="w-full px-3.5 py-2.5 bg-[#1e2229] border border-[#323842] rounded-md text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors disabled:opacity-60"
          />
        </div>

        <div>
          <textarea
            rows={4}
            placeholder="Enter your note content here"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (validationError) setValidationError(null);
            }}
            disabled={isSubmitting}
            className="w-full px-3.5 py-2.5 bg-[#1e2229] border border-[#323842] rounded-md text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors resize-y disabled:opacity-60"
          />
        </div>

        {validationError && (
          <p className="text-xs text-red-400 font-medium">{validationError}</p>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6366f1] hover:bg-[#5254e8] active:bg-[#4648d6] text-white text-xs sm:text-sm font-semibold rounded-md shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Create new note
          </button>
        </div>
      </form>
    </section>
  );
};
