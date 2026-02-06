import { useState, useEffect, useCallback, useRef } from 'react';
import { notes as notesApi } from '../api';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import { Menu, Check, PenLine, Plus } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  content: string;
  preview?: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [notesList, setNotesList] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [title, setTitle] = useState('');

  const loadNotes = useCallback(async () => {
    try {
      const data = await notesApi.list();
      setNotesList(data.notes);
    } catch (err) {
      console.error('Error loading notes:', err);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const selectNote = async (id: number) => {
    try {
      const data = await notesApi.get(id);
      setActiveNote(data.note);
      setTitle(data.note.title);
      setSidebarOpen(false);
    } catch (err) {
      console.error('Error loading note:', err);
    }
  };

  const createNote = async () => {
    try {
      const data = await notesApi.create('Sin título', '');
      await loadNotes();
      setActiveNote(data.note);
      setTitle(data.note.title);
      setSidebarOpen(false);
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const deleteNote = async (id: number) => {
    if (!confirm('¿Eliminar esta nota?')) return;
    try {
      await notesApi.delete(id);
      if (activeNote?.id === id) {
        setActiveNote(null);
        setTitle('');
      }
      await loadNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleSearch = async (q: string) => {
    try {
      if (q.trim()) {
        const data = await notesApi.search(q);
        setNotesList(data.notes);
      } else {
        await loadNotes();
      }
    } catch (err) {
      console.error('Error searching:', err);
    }
  };

  const autoSave = useCallback((noteId: number, data: { title?: string; content?: string }) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaved(false);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await notesApi.update(noteId, data);
        await loadNotes();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        console.error('Error saving:', err);
      } finally {
        setSaving(false);
      }
    }, 1500);
  }, [loadNotes]);

  const handleContentUpdate = (content: string) => {
    if (!activeNote) return;
    setActiveNote((prev) => prev ? { ...prev, content } : null);
    autoSave(activeNote.id, { content });
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!activeNote) return;
    setActiveNote((prev) => prev ? { ...prev, title: newTitle } : null);
    autoSave(activeNote.id, { title: newTitle });
  };

  return (
    <div className="h-screen flex bg-parchment">
      <Sidebar
        notes={notesList}
        activeNoteId={activeNote?.id ?? null}
        onSelectNote={selectNote}
        onCreateNote={createNote}
        onDeleteNote={deleteNote}
        onSearch={handleSearch}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-parchment-light/80 backdrop-blur-md">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-ink-faint hover:text-ink p-1 transition-colors"
          >
            <Menu size={20} />
          </button>

          {activeNote ? (
            <div className="flex-1 flex items-center gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="flex-1 bg-transparent font-display text-xl font-light text-ink focus:outline-none placeholder-ink-ghost tracking-tight"
                placeholder="Sin título"
              />
              <div className="flex items-center gap-1.5 text-xs flex-shrink-0">
                {saving && (
                  <span className="flex items-center gap-1.5 text-amber-dim animate-fade-in">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                    Guardando
                  </span>
                )}
                {saved && (
                  <span className="flex items-center gap-1 text-success animate-fade-in">
                    <Check size={12} />
                    Guardado
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-ink-ghost font-display italic">Selecciona o crea una nota</span>
          )}
        </div>

        {activeNote ? (
          <Editor content={activeNote.content || ''} onUpdate={handleContentUpdate} />
        ) : (
          <div className="flex-1 flex items-center justify-center animate-fade-in">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-parchment-card border border-border flex items-center justify-center">
                <PenLine size={32} className="text-ink-ghost" />
              </div>
              <p className="font-display text-2xl font-light text-ink-muted mb-1">
                Tu lienzo en blanco
              </p>
              <p className="text-sm text-ink-ghost mb-6">
                Selecciona una nota o crea una nueva
              </p>
              <button
                onClick={createNote}
                className="inline-flex items-center gap-2 bg-amber/15 hover:bg-amber/25 text-amber border border-amber/20 text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200"
              >
                <Plus size={16} />
                Nueva nota
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
