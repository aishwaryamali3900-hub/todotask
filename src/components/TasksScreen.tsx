import { RefObject, useMemo, useState } from 'react';
import { ArrowUpDown, Crosshair, Search, CheckCheck, X } from 'lucide-react';
import {
  ProjectId,
  Task,
  TaskPriority,
  TaskStatusFilter,
  WorkspaceScreen,
} from '../types';
import { getProjectMeta, isTaskOverdue } from '../utils/taskHelpers';
import { TaskInputCard } from './TaskInputCard';
import { TaskRow } from './TaskRow';

interface TasksScreenProps {
  tasks: Task[];
  selectedProjectFilter: ProjectId | 'all';
  selectedTaskId: string | null;
  quickInputRef: RefObject<HTMLInputElement | null>;
  onClearProjectFilter: () => void;
  onAddTask: (payload: {
    title: string;
    projectId: ProjectId;
    priority: TaskPriority;
    dueDate: string;
    estimateMinutes: number;
  }) => void;
  onToggleComplete: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onOpenDetail: (taskId: string) => void;
  onFocusTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onClearCompleted: () => void;
  onNavigate: (screen: WorkspaceScreen) => void;
}

type SortMode = 'smart' | 'due' | 'estimate';

export function TasksScreen({
  tasks,
  selectedProjectFilter,
  selectedTaskId,
  quickInputRef,
  onClearProjectFilter,
  onAddTask,
  onToggleComplete,
  onToggleStar,
  onOpenDetail,
  onFocusTask,
  onDeleteTask,
  onClearCompleted,
  onNavigate,
}: TasksScreenProps) {
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>(
    TaskStatusFilter.All
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('smart');

  const scopedTasks = useMemo(() => {
    if (selectedProjectFilter === 'all') return tasks;
    return tasks.filter((t) => t.projectId === selectedProjectFilter);
  }, [tasks, selectedProjectFilter]);

  const counts = useMemo(() => {
    return {
      all: scopedTasks.length,
      pending: scopedTasks.filter((t) => !t.completed).length,
      completed: scopedTasks.filter((t) => t.completed).length,
      overdue: scopedTasks.filter((t) => isTaskOverdue(t)).length,
    };
  }, [scopedTasks]);

  const visibleTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = scopedTasks.filter((task) => {
      if (statusFilter === TaskStatusFilter.Pending && task.completed) return false;
      if (statusFilter === TaskStatusFilter.Completed && !task.completed) return false;
      if (statusFilter === TaskStatusFilter.Overdue && !isTaskOverdue(task)) return false;
      if (q && !task.title.toLowerCase().includes(q) && !task.notes.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      // Completed tasks always settle below active tasks in smart mode
      if (sortMode === 'smart') {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.starred !== b.starred) return a.starred ? -1 : 1;
        const aOverdue = isTaskOverdue(a);
        const bOverdue = isTaskOverdue(b);
        if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortMode === 'due') {
        return a.dueDate.localeCompare(b.dueDate);
      }
      return b.estimateMinutes - a.estimateMinutes;
    });
  }, [scopedTasks, statusFilter, searchQuery, sortMode]);

  const activeProjectMeta =
    selectedProjectFilter !== 'all' ? getProjectMeta(selectedProjectFilter) : null;

  const filterTabs: { id: TaskStatusFilter; label: string; count: number }[] = [
    { id: TaskStatusFilter.All, label: 'All', count: counts.all },
    { id: TaskStatusFilter.Pending, label: 'Pending', count: counts.pending },
    { id: TaskStatusFilter.Completed, label: 'Completed', count: counts.completed },
    { id: TaskStatusFilter.Overdue, label: 'Overdue', count: counts.overdue },
  ];

  return (
    <div className="space-y-6">
      {/* Screen Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#0F172A]">
              {activeProjectMeta ? activeProjectMeta.name : 'Today & Inbox'}
            </h1>
            {activeProjectMeta && (
              <button
                type="button"
                onClick={onClearProjectFilter}
                aria-label="Clear stream filter"
                className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-2 py-0.5 text-xs font-medium text-[#475569] hover:bg-[#F1F5F9]"
              >
                All streams
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="mt-1 text-sm text-[#475569]">
            <span>Tue, Nov 24</span>
            <span aria-hidden="true"> · </span>
            <span className="font-mono tabular-nums">{counts.pending} pending</span>
            {counts.overdue > 0 && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="font-mono font-medium text-[#DC2626] tabular-nums">
                  {counts.overdue} overdue
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {counts.completed > 0 && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#F1F5F9] whitespace-nowrap"
            >
              <CheckCheck className="h-3.5 w-3.5 text-[#64748B]" aria-hidden="true" />
              Clear Completed
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate(WorkspaceScreen.Focus)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4338CA] whitespace-nowrap"
          >
            <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
            Enter Focus
          </button>
        </div>
      </div>

      {/* Quick Task Input Form */}
      <TaskInputCard
        inputRef={quickInputRef}
        defaultProjectId={
          selectedProjectFilter !== 'all' ? selectedProjectFilter : ProjectId.Engineering
        }
        onAddTask={onAddTask}
      />

      {/* Segmented Filter Bar + Search & Sort */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div
          role="tablist"
          aria-label="Filter tasks by status"
          className="inline-flex items-center gap-1 overflow-x-auto rounded-lg bg-[#F1F5F9] p-1 self-start max-w-full"
        >
          {filterTabs.map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatusFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-all whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#FFFFFF] font-semibold text-[#0F172A] shadow-xs'
                    : 'font-medium text-[#64748B] hover:text-[#334155]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    active ? 'text-[#4F46E5]' : 'text-[#94A3B8]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks..."
              aria-label="Filter tasks by keyword"
              className="w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] py-1.5 pl-8 pr-3 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none"
            />
          </div>

          <label className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 py-1.5 text-xs font-medium text-[#475569]">
            <ArrowUpDown className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden="true" />
            <span className="sr-only">Sort order</span>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              aria-label="Sort tasks"
              className="bg-transparent text-xs font-medium text-[#334155] focus:outline-none focus-visible:shadow-none cursor-pointer"
            >
              <option value="smart">Priority & Due</option>
              <option value="due">Due Date</option>
              <option value="estimate">Duration</option>
            </select>
          </label>
        </div>
      </div>

      {/* Task List (12px vertical rhythm) */}
      {visibleTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#FFFFFF] px-6 py-12 text-center">
          <p className="text-sm font-semibold text-[#0F172A]">
            No tasks match this view
          </p>
          <p className="mt-1 text-xs text-[#64748B]">
            {searchQuery
              ? `No results found for "${searchQuery}".`
              : 'Capture a new task above or switch filters to review other items.'}
          </p>
          {(statusFilter !== TaskStatusFilter.All || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter(TaskStatusFilter.All);
                setSearchQuery('');
              }}
              className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9] transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3" role="list" aria-label="Task list">
          {visibleTasks.map((task) => (
            <div key={task.id} role="listitem">
              <TaskRow
                task={task}
                isSelected={task.id === selectedTaskId}
                onToggleComplete={onToggleComplete}
                onToggleStar={onToggleStar}
                onOpenDetail={onOpenDetail}
                onFocusTask={onFocusTask}
                onDeleteTask={onDeleteTask}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
