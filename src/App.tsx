import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Note,
  NotePayload,
  SortOption,
  ToastMessage,
  ToastType,
  ApiConfig,
} from './types/note';
import { notesApi, getApiConfig, saveApiConfig } from './services/api';
import { Navbar } from './components/Navbar';
import { NoteForm } from './components/NoteForm';
import { FilterBar } from './components/FilterBar';
import { NoteCard } from './components/NoteCard';
import { NoteSkeleton } from './components/NoteSkeleton';
import { EmptyState } from './components/EmptyState';
import { ViewNoteModal } from './components/modals/ViewNoteModal';
import { EditNoteModal } from './components/modals/EditNoteModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { ApiSettingsModal } from './components/modals/ApiSettingsModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(false);

  // Action loading states
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  // Filter & Sort states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Active Modals
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>(getApiConfig);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch all notes
  const fetchNotes = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await notesApi.getAllNotes();
        setNotes(result.notes);
        setIsOfflineFallback(result.isOfflineFallback);
      } catch (err: any) {
        const msg = err?.message || 'Failed to load notes from the server.';
        setError(msg);
        addToast(msg, 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [addToast]
  );

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Create Note handler
  const handleCreateNote = async (payload: NotePayload): Promise<boolean> => {
    setIsCreating(true);
    try {
      const created = await notesApi.createNote(payload);
      setNotes((prev) => [created, ...prev]);
      addToast('Note created successfully!', 'success');
      return true;
    } catch (err: any) {
      addToast(err?.message || 'Failed to create note.', 'error');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  // View Single Note details (calls GET /api/notes/:id)
  const handleViewNote = async (note: Note) => {
    setViewingNote(note);
    setIsLoadingDetails(true);
    try {
      const freshNote = await notesApi.getNoteById(note.id);
      setViewingNote(freshNote);
    } catch (err: any) {
      addToast('Could not refresh note details.', 'error');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Update Note handler
  const handleUpdateNote = async (
    id: string,
    payload: NotePayload
  ): Promise<boolean> => {
    setIsUpdating(true);
    try {
      const updated = await notesApi.updateNote(id, payload);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      addToast('Note updated successfully!', 'success');
      return true;
    } catch (err: any) {
      addToast(err?.message || 'Failed to update note.', 'error');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Note handler
  const handleConfirmDelete = async (id: string): Promise<void> => {
    setIsDeleting(true);
    try {
      await notesApi.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setDeletingNote(null);
      addToast('Note deleted successfully.', 'success');
    } catch (err: any) {
      addToast(err?.message || 'Failed to delete note.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q)
        )
      : [...notes];

    return filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });
  }, [notes, searchQuery, sortBy]);

  const handleSaveApiConfig = (newConfig: ApiConfig) => {
    saveApiConfig(newConfig);
    setApiConfig(newConfig);
    addToast('API configuration updated.', 'info');
    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-[#181b20] text-gray-100 flex flex-col">
      <Navbar
        isOfflineFallback={isOfflineFallback}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <NoteForm onCreateNote={handleCreateNote} isSubmitting={isCreating} />

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalNotes={filteredAndSortedNotes.length}
        />

        {isLoading ? (
          <NoteSkeleton count={6} />
        ) : error ? (
          <div className="bg-red-950/30 border border-red-500/40 rounded-lg p-6 text-center my-6">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-red-200 mb-1">
              Error Loading Notes
            </h3>
            <p className="text-xs sm:text-sm text-red-300/90 mb-4">{error}</p>
            <button
              type="button"
              onClick={fetchNotes}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-md transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Connection
            </button>
          </div>
        ) : filteredAndSortedNotes.length === 0 ? (
          <EmptyState
            hasSearchQuery={Boolean(searchQuery.trim())}
            onClearSearch={() => setSearchQuery('')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onView={handleViewNote}
                onEdit={(n) => setEditingNote(n)}
                onDelete={(n) => setDeletingNote(n)}
              />
            ))}
          </div>
        )}
      </main>

      <ViewNoteModal
        note={viewingNote}
        isLoadingDetails={isLoadingDetails}
        onClose={() => setViewingNote(null)}
        onEdit={(n) => setEditingNote(n)}
        onDelete={(n) => setDeletingNote(n)}
      />

      <EditNoteModal
        note={editingNote}
        isSubmitting={isUpdating}
        onClose={() => setEditingNote(null)}
        onSave={handleUpdateNote}
      />

      <DeleteConfirmModal
        note={deletingNote}
        isDeleting={isDeleting}
        onCancel={() => setDeletingNote(null)}
        onConfirm={handleConfirmDelete}
      />

      <ApiSettingsModal
        isOpen={isSettingsOpen}
        config={apiConfig}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveApiConfig}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
