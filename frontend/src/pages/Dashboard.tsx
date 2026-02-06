import { useState, useEffect, useCallback, useRef } from 'react';
import { notes as notesApi } from '../api';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import { Menu, Check, Loader2 } from 'lucide-react';

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
    <div className="h-screen flex bg-[#191919]">
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
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#2a2a2a] bg-[#1e1e1e]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-[#888] hover:text-white p-1"
          >
            <Menu size={20} />
          </button>

          {activeNote ? (
            <div className="flex-1 flex items-center gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="flex-1 bg-transparent text-white text-lg font-semibold focus:outline-none placeholder-[#555]"
                placeholder="Sin título"
              />
              <div className="flex items-center gap-1.5 text-xs text-[#666] flex-shrink-0">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saved && <Check size={14} className="text-green-400" />}
                <span>{saving ? 'Guardando...' : saved ? 'Guardado' : ''}</span>
              </div>
            </div>
          ) : (
            <span className="text-[#555]">Selecciona o crea una nota</span>
          )}
        </div>

        {activeNote ? (
          <Editor content={activeNote.content || ''} onUpdate={handleContentUpdate} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-[#555]">
              <p className="text-lg mb-2">Ninguna nota seleccionada</p>
              <button
                onClick={createNote}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Crear una nueva nota
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
