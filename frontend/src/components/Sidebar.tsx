import { useState } from 'react';
import {
  Plus, Search, Trash2, LogOut, X, PenLine
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Note {
  id: number;
  title: string;
  preview?: string;
  updated_at: string;
}

interface SidebarProps {
  notes: Note[];
  activeNoteId: number | null;
  onSelectNote: (id: number) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: number) => void;
  onSearch: (q: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function Sidebar({
  notes, activeNoteId, onSelectNote, onCreateNote,
  onDeleteNote, onSearch, isOpen, onToggle
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    onSearch(val);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden" onClick={onToggle} />
      )}

      <aside className={`
        fixed md:relative z-30 top-0 left-0 h-full
        w-72 bg-parchment-light border-r border-border
        flex flex-col transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:w-72 md:flex-shrink-0
      `}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">&#9998;</span>
              <span className="font-display text-lg font-light text-ink tracking-tight">
                Opus <span className="font-semibold italic">Notes</span>
              </span>
            </div>
            <button onClick={onToggle} className="md:hidden text-ink-faint hover:text-ink p-1 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-ghost" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar notas..."
              className="w-full bg-parchment border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-ink placeholder-ink-ghost focus:outline-none focus:border-amber-dim/50 focus:ring-1 focus:ring-amber/10 transition-all duration-200"
            />
          </div>

          <button
            onClick={onCreateNote}
            className="w-full flex items-center justify-center gap-2 bg-amber/15 hover:bg-amber/25 text-amber border border-amber/20 text-sm font-medium py-2 rounded-lg transition-all duration-200"
          >
            <Plus size={15} />
            Nueva nota
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2">
          {notes.length === 0 ? (
            <div className="text-center text-ink-ghost text-sm py-12 px-4">
              <PenLine size={32} className="mx-auto mb-3 text-ink-ghost/50" />
              <p className="font-display italic">
                {searchQuery ? 'Sin resultados' : 'Aún no hay notas'}
              </p>
              {!searchQuery && (
                <p className="text-xs mt-1 text-ink-ghost/70">Crea tu primera nota</p>
              )}
            </div>
          ) : (
            notes.map((note, i) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                style={{ animationDelay: `${i * 30}ms` }}
                className={`group flex items-start gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 animate-slide-in ${
                  activeNoteId === note.id
                    ? 'bg-amber-glow border border-amber/15'
                    : 'hover:bg-parchment-hover border border-transparent'
                }`}
              >
                <div className={`w-1 self-stretch rounded-full flex-shrink-0 transition-colors ${
                  activeNoteId === note.id ? 'bg-amber' : 'bg-transparent'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm truncate transition-colors ${
                    activeNoteId === note.id ? 'text-ink font-medium' : 'text-ink-muted'
                  }`}>
                    {note.title || 'Sin título'}
                  </div>
                  <div className="text-xs text-ink-ghost mt-0.5">
                    {timeAgo(note.updated_at)}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-ink-ghost hover:text-danger transition-all flex-shrink-0"
                  title="Eliminar"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-amber/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-semibold text-amber uppercase">
                  {user?.email?.charAt(0) || '?'}
                </span>
              </div>
              <span className="text-xs text-ink-faint truncate">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="text-ink-ghost hover:text-danger p-1.5 rounded-md hover:bg-danger/10 transition-all"
              title="Cerrar sesión"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
