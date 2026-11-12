import React from 'react';
import { Note } from '../../types/note';
import { X, Pencil, Trash2, Calendar, Clock } from 'lucide-react';

interface ViewNoteModalProps {
  note: Note | null;
  isLoadingDetails: boolean;
  onClose: () => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export const ViewNoteModal: React.FC<ViewNoteModalProps> = ({
  note,
  isLoadingDetails,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!note) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1e2229] border border-[#323842] rounded-lg max-w-xl w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white break-words">
              {note.title}
            </h2>
            {isLoadingDetails && (
              <span className="text-xs text-indigo-400">
                Syncing latest details from server...
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 max-h-[60vh] overflow-y-auto">
          <p className="text-sm sm:text-base text-gray-200 whitespace-pre-line leading-relaxed">
            {note.content}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>Updated: {new Date(note.updatedAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(note);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-md font-medium transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(note);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-md font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
