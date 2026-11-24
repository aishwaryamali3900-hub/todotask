import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { INITIAL_TASKS } from './data/initialTasks';
import { ProjectId, Task, TaskPriority, ToastMessage, WorkspaceScreen } from './types';
import { Sidebar } from './components/Sidebar';
import { TasksScreen } from './components/TasksScreen';
import { FocusScreen } from './components/FocusScreen';
import { ProjectsScreen } from './components/ProjectsScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { TaskDetailDrawer } from './components/TaskDetailDrawer';
import { CommandPalette } from './components/CommandPalette';
import { Toast } from './components/Toast';

const STORAGE_KEY = 'clarity_workspace_tasks_v1';

function loadInitialTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(loadInitialTasks);
  const [activeScreen, setActiveScreen] = useState<WorkspaceScreen>(
    WorkspaceScreen.Tasks
  );
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<
    ProjectId | 'all'
  >('all');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const quickInputRef = useRef<HTMLInputElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [tasks]);

  const showToast = useCallback(
    (
      message: string,
      tone: ToastMessage['tone'] = 'info',
      undoAction?: () => void
    ) => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      setToast({
        id: String(Date.now()),
        message,
        tone,
        undoAction,
      });
      toastTimerRef.current = window.setTimeout(() => {
        setToast(null);
      }, 4500);
    },
    []
  );

  // Global keyboard-first shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((open) => !open);
        return;
      }

      if (e.key === 'Escape') {
        if (commandOpen) {
          setCommandOpen(false);
        } else if (selectedTaskId) {
          setSelectedTaskId(null);
        } else if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
        return;
      }

      const target = e.target as HTMLElement | null;
      const isEditing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable;

      if (isEditing || commandOpen) return;

      if (e.key === '/') {
        e.preventDefault();
        setActiveScreen(WorkspaceScreen.Tasks);
        window.setTimeout(() => quickInputRef.current?.focus(), 20);
      } else if (e.key === '1') {
        setActiveScreen(WorkspaceScreen.Tasks);
      } else if (e.key === '2') {
        setActiveScreen(WorkspaceScreen.Focus);
      } else if (e.key === '3') {
        setActiveScreen(WorkspaceScreen.Projects);
      } else if (e.key === '4') {
        setActiveScreen(WorkspaceScreen.Insights);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandOpen, mobileMenuOpen, selectedTaskId]);

  const handleAddTask = useCallback(
    (payload: {
      title: string;
      projectId: ProjectId;
      priority: TaskPriority;
      dueDate: string;
      estimateMinutes: number;
    }) => {
      const newTask: Task = {
        id: `tsk-${Date.now()}`,
        title: payload.title,
        notes: '',
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
        dueDate: payload.dueDate,
        estimateMinutes: payload.estimateMinutes,
        projectId: payload.projectId,
        priority: payload.priority,
        starred: false,
        subtasks: [],
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('Task added to workspace', 'success');
    },
    [showToast]
  );

  const handleToggleComplete = useCallback(
    (taskId: string) => {
      let toggledTitle = '';
      let becameCompleted = false;
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          toggledTitle = t.title;
          becameCompleted = !t.completed;
          return {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? new Date().toISOString() : null,
          };
        })
      );

      if (becameCompleted && toggledTitle) {
        showToast('Task completed', 'success', () => {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId ? { ...t, completed: false, completedAt: null } : t
            )
          );
        });
      }
    },
    [showToast]
  );

  const handleToggleStar = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, starred: !t.starred } : t))
    );
  }, []);

  const handleUpdateTask = useCallback((taskId: string, patch: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t))
    );
  }, []);

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      const snapshot = tasks.find((t) => t.id === taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      }
      if (snapshot) {
        showToast('Task deleted', 'danger', () => {
          setTasks((prev) => [snapshot, ...prev]);
        });
      }
    },
    [selectedTaskId, showToast, tasks]
  );

  const handleClearCompleted = useCallback(() => {
    const previous = tasks;
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) return;
    setTasks((prev) => prev.filter((t) => !t.completed));
    showToast(`Cleared ${completedCount} completed tasks`, 'info', () => {
      setTasks(previous);
    });
  }, [showToast, tasks]);

  const handleFocusTask = useCallback((taskId: string) => {
    setFocusedTaskId(taskId);
    setActiveScreen(WorkspaceScreen.Focus);
  }, []);

  const handleExportTasks = useCallback(() => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clarity-workspace-tasks.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported tasks as JSON', 'success');
  }, [showToast, tasks]);

  const handleResetDemo = useCallback(() => {
    const previous = tasks;
    setTasks(INITIAL_TASKS);
    setSelectedTaskId(null);
    setSelectedProjectFilter('all');
    showToast('Workspace reset to starter tasks', 'info', () => {
      setTasks(previous);
    });
  }, [showToast, tasks]);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col lg:flex-row">
      {/* Sidebar Rail (Desktop 280px + Mobile Drawer) */}
      <Sidebar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        selectedProjectFilter={selectedProjectFilter}
        onSelectProjectFilter={setSelectedProjectFilter}
        tasks={tasks}
        onOpenCommandPalette={() => setCommandOpen(true)}
        onExportTasks={handleExportTasks}
        onResetDemo={handleResetDemo}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Mobile / Tablet Compact Top Bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E2E8F0] bg-[#FFFFFF]/95 px-4 backdrop-blur-xs lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open workspace navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="text-base font-bold tracking-[-0.02em] text-[#0F172A]">
            Clarity
          </span>
        </div>

        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          aria-label="Open command palette"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1.5 text-xs font-medium text-[#475569]"
        >
          <Search className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden="true" />
          <span>Search</span>
        </button>
      </header>

      {/* Main Fluid Workspace (Capped at 1120px) */}
      <main className="flex-1 min-w-0">
        <div className="mx-auto w-full max-w-[1120px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {activeScreen === WorkspaceScreen.Tasks && (
            <TasksScreen
              tasks={tasks}
              selectedProjectFilter={selectedProjectFilter}
              selectedTaskId={selectedTaskId}
              quickInputRef={quickInputRef}
              onClearProjectFilter={() => setSelectedProjectFilter('all')}
              onAddTask={handleAddTask}
              onToggleComplete={handleToggleComplete}
              onToggleStar={handleToggleStar}
              onOpenDetail={(id) => setSelectedTaskId(id)}
              onFocusTask={handleFocusTask}
              onDeleteTask={handleDeleteTask}
              onClearCompleted={handleClearCompleted}
              onNavigate={setActiveScreen}
            />
          )}

          {activeScreen === WorkspaceScreen.Focus && (
            <FocusScreen
              tasks={tasks}
              focusedTaskId={focusedTaskId}
              onSelectFocusTask={(id) => setFocusedTaskId(id)}
              onToggleComplete={handleToggleComplete}
              onUpdateTask={handleUpdateTask}
              onNavigate={setActiveScreen}
            />
          )}

          {activeScreen === WorkspaceScreen.Projects && (
            <ProjectsScreen
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onOpenDetail={(id) => setSelectedTaskId(id)}
              onAddTask={handleAddTask}
              onFilterInInbox={(projectId) => {
                setSelectedProjectFilter(projectId);
                setActiveScreen(WorkspaceScreen.Tasks);
              }}
            />
          )}

          {activeScreen === WorkspaceScreen.Insights && (
            <InsightsScreen
              tasks={tasks}
              onOpenDetail={(id) => setSelectedTaskId(id)}
              onNavigate={setActiveScreen}
            />
          )}
        </div>
      </main>

      {/* Task Detail Context Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onFocusTask={handleFocusTask}
      />

      {/* Command Palette Overlay */}
      <CommandPalette
        open={commandOpen}
        tasks={tasks}
        onClose={() => setCommandOpen(false)}
        onNavigate={(screen) => {
          if (screen === WorkspaceScreen.Tasks) {
            setSelectedProjectFilter('all');
          }
          setActiveScreen(screen);
        }}
        onSelectTask={(id) => setSelectedTaskId(id)}
        onFocusQuickInput={() => quickInputRef.current?.focus()}
      />

      {/* Action Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
