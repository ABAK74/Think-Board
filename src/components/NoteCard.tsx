import React from 'react';
import { Note } from '../types/note';
import { Eye, Pencil, Trash2, Clock } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onView,
  onEdit,
  onDelete,
}) => {
  const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <article
      onClick={() => onView(note)}
      className="group bg-[#1e2229] border border-[#323842] hover:border-[#6366f1]/60 rounded-lg p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:shadow-black/30 cursor-pointer"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold text-gray-100 group-hover:text-[#818cf8] transition-colors line-clamp-1">
            {note.title}
          </h3>
        </div>
        <p className="text-sm text-gray-300/90 whitespace-pre-line line-clamp-4 leading-relaxed mb-4">
          {note.content}
        </p>
      </div>

      <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formattedDate}
        </span>

        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onView(note)}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="View details"
            aria-label="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-md text-gray-400 hover:text-indigo-400 hover:bg-gray-800 transition-colors"
            title="Edit note"
            aria-label="Edit note"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(note)}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
            title="Delete note"
            aria-label="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
