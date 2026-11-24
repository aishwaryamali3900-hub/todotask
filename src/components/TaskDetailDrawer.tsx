import { FormEvent, useState } from 'react';
import { Check, Crosshair, Plus, Trash2, X } from 'lucide-react';
import { PROJECTS } from '../data/initialTasks';
import { ProjectId, Task, TaskPriority } from '../types';
import { isTaskOverdue } from '../utils/taskHelpers';

interface TaskDetailDrawerProps {
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (taskId: string, patch: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onFocusTask: (taskId: string) => void;
}

export function TaskDetailDrawer({
  task,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onFocusTask,
}: TaskDetailDrawerProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  if (!task) return null;

  const overdue = isTaskOverdue(task);

  const handleAddSubtask = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newSubtaskTitle.trim();
    if (!trimmed) return;
    onUpdateTask(task.id, {
      subtasks: [
        ...task.subtasks,
        {
          id: `sub-${Date.now()}`,
          title: trimmed,
          completed: false,
        },
      ],
    });
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    onUpdateTask(task.id, {
      subtasks: task.subtasks.map((s) =>
        s.id === subtaskId ? { ...s, completed: !s.completed } : s
      ),
    });
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    onUpdateTask(task.id, {
      subtasks: task.subtasks.filter((s) => s.id !== subtaskId),
    });
  };

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-task-heading"
    >
      <div
        className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-50 flex h-full w-full max-w-[460px] flex-col border-l border-[#E2E8F0] bg-[#FFFFFF] shadow-clarity-3">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                onUpdateTask(task.id, {
                  completed: !task.completed,
                  completedAt: !task.completed ? new Date().toISOString() : null,
                })
              }
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                task.completed
                  ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]'
                  : 'border-[#E2E8F0] bg-[#FFFFFF] text-[#334155] hover:bg-[#F1F5F9]'
              }`}
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              {task.completed ? 'Completed' : 'Mark Complete'}
            </button>

            {!task.completed && (
              <button
                type="button"
                onClick={() => {
                  onFocusTask(task.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#4F46E5] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#4338CA]"
              >
                <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
                Focus
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close task details"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Editable Task Title */}
          <div>
            <label htmlFor="drawer-task-heading" className="sr-only">
              Task title
            </label>
            <textarea
              id="drawer-task-heading"
              rows={2}
              value={task.title}
              onChange={(e) => onUpdateTask(task.id, { title: e.target.value })}
              className={`w-full resize-none rounded-lg border border-transparent bg-transparent p-1 text-lg font-semibold leading-snug text-[#0F172A] hover:border-[#E2E8F0] focus:border-[#4F46E5] focus:bg-[#FFFFFF] focus:outline-none ${
                task.completed ? 'line-through text-[#94A3B8]' : ''
              }`}
            />
            {overdue && (
              <p className="mt-1 px-1 text-xs font-medium text-[#DC2626]">
                Past scheduled due date
              </p>
            )}
          </div>

          {/* Structured Properties Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div>
              <label
                htmlFor="detail-project"
                className="block text-xs font-medium text-[#64748B]"
              >
                Stream
              </label>
              <select
                id="detail-project"
                value={task.projectId}
                onChange={(e) =>
                  onUpdateTask(task.id, { projectId: e.target.value as ProjectId })
                }
                className="mt-1.5 w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 py-1.5 text-sm font-medium text-[#0F172A]"
              >
                {PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="detail-priority"
                className="block text-xs font-medium text-[#64748B]"
              >
                Priority
              </label>
              <select
                id="detail-priority"
                value={task.priority}
                onChange={(e) =>
                  onUpdateTask(task.id, { priority: e.target.value as TaskPriority })
                }
                className="mt-1.5 w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 py-1.5 text-sm font-medium text-[#0F172A]"
              >
                <option value={TaskPriority.Normal}>Standard</option>
                <option value={TaskPriority.Urgent}>Urgent</option>
                <option value={TaskPriority.High}>High Priority</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="detail-due"
                className="block text-xs font-medium text-[#64748B]"
              >
                Due Date
              </label>
              <input
                id="detail-due"
                type="date"
                value={task.dueDate}
                onChange={(e) => onUpdateTask(task.id, { dueDate: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 py-1.5 font-mono text-sm text-[#0F172A]"
              />
            </div>

            <div>
              <label
                htmlFor="detail-estimate"
                className="block text-xs font-medium text-[#64748B]"
              >
                Time Estimate
              </label>
              <select
                id="detail-estimate"
                value={task.estimateMinutes}
                onChange={(e) =>
                  onUpdateTask(task.id, { estimateMinutes: Number(e.target.value) })
                }
                className="mt-1.5 w-full rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 py-1.5 font-mono text-sm text-[#0F172A]"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="detail-notes"
              className="block text-xs font-semibold tracking-[0.01em] text-[#475569]"
            >
              Execution Notes
            </label>
            <textarea
              id="detail-notes"
              rows={4}
              value={task.notes}
              onChange={(e) => onUpdateTask(task.id, { notes: e.target.value })}
              placeholder="Add technical context, acceptance criteria, or links..."
              className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-3 text-sm leading-relaxed text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none"
            />
          </div>

          {/* Subtasks */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-[0.01em] text-[#475569]">
                Checklist
              </span>
              <span className="font-mono text-xs text-[#64748B] tabular-nums">
                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
              </span>
            </div>

            <div className="mt-2.5 space-y-2">
              {task.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="group flex items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(sub.id)}
                    className="flex flex-1 items-center gap-2.5 text-left min-w-0"
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-colors ${
                        sub.completed
                          ? 'border-[#10B981] bg-[#10B981] text-white'
                          : 'border-[#CBD5E1] bg-white'
                      }`}
                    >
                      {sub.completed && (
                        <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
                      )}
                    </span>
                    <span
                      className={`truncate text-sm ${
                        sub.completed
                          ? 'line-through text-[#94A3B8]'
                          : 'text-[#0F172A]'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(sub.id)}
                    aria-label={`Remove subtask "${sub.title}"`}
                    className="flex h-6 w-6 items-center justify-center rounded text-[#94A3B8] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}

              <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Add a checklist step..."
                  aria-label="New subtask title"
                  className="flex-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-[#FFFFFF] focus:border-[#4F46E5] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newSubtaskTitle.trim()}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9] disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="flex items-center justify-between border-t border-[#E2E8F0] px-6 py-4">
          <span className="font-mono text-xs text-[#94A3B8]">
            Est. {task.estimateMinutes}m
          </span>
          <button
            type="button"
            onClick={() => {
              onDeleteTask(task.id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FECDD3] bg-[#FEF2F2] px-3 py-1.5 text-xs font-semibold text-[#EF4444] transition-colors hover:bg-[#FEE2E2]"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
