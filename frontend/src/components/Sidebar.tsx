import { useState } from 'react';
import {
  Plus, Search, FileText, Trash2, LogOut, X, ChevronRight
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
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onToggle} />
      )}

      <aside className={`
        fixed md:relative z-30 top-0 left-0 h-full
        w-72 bg-[#1e1e1e] border-r border-[#2a2a2a]
        flex flex-col transition-transform duration-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:w-72 md:flex-shrink-0
      `}>
        <div className="p-3 border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-white text-sm">Opus Notes</span>
            </div>
            <button onClick={onToggle} className="md:hidden text-[#888] hover:text-white p-1">
              <X size={18} />
            </button>
          </div>

          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#666]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar notas..."
              className="w-full bg-[#141414] border border-[#333] rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <button
            onClick={onCreateNote}
            className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Nueva nota
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {notes.length === 0 ? (
            <div className="text-center text-[#555] text-sm py-8 px-4">
              {searchQuery ? 'Sin resultados' : 'No hay notas aún'}
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`group flex items-start gap-2 px-3 py-2.5 mx-1 rounded-lg cursor-pointer transition-colors ${
                  activeNoteId === note.id
                    ? 'bg-[#2a2a2a]'
                    : 'hover:bg-[#252525]'
                }`}
              >
                <ChevronRight size={14} className="text-[#555] mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">
                    {note.title || 'Sin título'}
                  </div>
                  <div className="text-xs text-[#666] mt-0.5">
                    {timeAgo(note.updated_at)}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[#666] hover:text-red-400 transition-all"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#666] truncate">{user?.email}</span>
            <button onClick={logout} className="text-[#666] hover:text-red-400 p-1 transition-colors" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
