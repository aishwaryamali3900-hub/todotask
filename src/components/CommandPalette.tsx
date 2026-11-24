import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  CheckSquare,
  Crosshair,
  FolderKanban,
  Search,
  CornerDownLeft,
} from 'lucide-react';
import { Task, WorkspaceScreen } from '../types';
import { getProjectMeta } from '../utils/taskHelpers';

interface CommandPaletteProps {
  open: boolean;
  tasks: Task[];
  onClose: () => void;
  onNavigate: (screen: WorkspaceScreen) => void;
  onSelectTask: (taskId: string) => void;
  onFocusQuickInput: () => void;
}

export function CommandPalette({
  open,
  tasks,
  onClose,
  onNavigate,
  onSelectTask,
  onFocusQuickInput,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      window.setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  const actions = useMemo(
    () => [
      {
        id: 'act-new',
        label: 'Capture new task',
        hint: '/',
        icon: CheckSquare,
        run: () => {
          onNavigate(WorkspaceScreen.Tasks);
          onClose();
          window.setTimeout(onFocusQuickInput, 50);
        },
      },
      {
        id: 'act-today',
        label: 'Go to Today & Inbox',
        hint: '1',
        icon: CheckSquare,
        run: () => {
          onNavigate(WorkspaceScreen.Tasks);
          onClose();
        },
      },
      {
        id: 'act-focus',
        label: 'Enter Focus Mode',
        hint: '2',
        icon: Crosshair,
        run: () => {
          onNavigate(WorkspaceScreen.Focus);
          onClose();
        },
      },
      {
        id: 'act-projects',
        label: 'Open Project Streams',
        hint: '3',
        icon: FolderKanban,
        run: () => {
          onNavigate(WorkspaceScreen.Projects);
          onClose();
        },
      },
      {
        id: 'act-insights',
        label: 'View Weekly Review',
        hint: '4',
        icon: BarChart3,
        run: () => {
          onNavigate(WorkspaceScreen.Insights);
          onClose();
        },
      },
    ],
    [onClose, onFocusQuickInput, onNavigate]
  );

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const matchedActions = actions.filter((a) =>
    a.label.toLowerCase().includes(q)
  );
  const matchedTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(q))
    .slice(0, 6);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="fixed inset-0 bg-[#0F172A]/25 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-clarity-3">
        <div className="flex items-center gap-3 border-b border-[#E2E8F0] px-4 py-3.5">
          <Search className="h-4 w-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to screen or search tasks..."
            aria-label="Search commands and tasks"
            className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus-visible:shadow-none"
          />
          <kbd className="rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5 font-mono text-[11px] text-[#64748B]">
            Esc
          </kbd>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 space-y-3">
          {matchedActions.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[11px] font-medium text-[#64748B]">
                Navigation & Actions
              </div>
              {matchedActions.map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={act.run}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-[#0F172A] hover:bg-[#EEF2FF] hover:text-[#3525CD] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-[#94A3B8]" aria-hidden="true" />
                      <span className="font-medium">{act.label}</span>
                    </span>
                    <kbd className="font-mono text-[11px] text-[#94A3B8]">
                      {act.hint}
                    </kbd>
                  </button>
                );
              })}
            </div>
          )}

          {matchedTasks.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[11px] font-medium text-[#64748B]">
                Tasks
              </div>
              {matchedTasks.map((task) => {
                const proj = getProjectMeta(task.projectId);
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => {
                      onSelectTask(task.id);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="min-w-0">
                      <div
                        className={`truncate text-sm font-medium ${
                          task.completed
                            ? 'line-through text-[#94A3B8]'
                            : 'text-[#0F172A]'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="text-xs text-[#64748B]">{proj.name}</div>
                    </div>
                    <CornerDownLeft
                      className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {matchedActions.length === 0 && matchedTasks.length === 0 && (
            <div className="py-8 text-center text-sm text-[#64748B]">
              No matching commands or tasks found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
