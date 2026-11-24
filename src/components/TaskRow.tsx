import { Check, Crosshair, Star, Trash2, AlertTriangle, Clock } from 'lucide-react';
import { Task, TaskPriority } from '../types';
import {
  formatDueDateLabel,
  formatDurationLabel,
  getProjectMeta,
  isTaskOverdue,
} from '../utils/taskHelpers';

interface TaskRowProps {
  task: Task;
  isSelected?: boolean;
  onToggleComplete: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onOpenDetail: (taskId: string) => void;
  onFocusTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskRow({
  task,
  isSelected = false,
  onToggleComplete,
  onToggleStar,
  onOpenDetail,
  onFocusTask,
  onDeleteTask,
}: TaskRowProps) {
  const project = getProjectMeta(task.projectId);
  const overdue = isTaskOverdue(task);
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  return (
    <div
      className={`group flex items-start gap-3.5 rounded-xl border bg-[#FFFFFF] px-4 py-3.5 shadow-clarity-1 transition-all duration-150 hover:-translate-y-[1px] hover:shadow-clarity-2 ${
        isSelected ? 'border-[#4F46E5]' : 'border-[#E2E8F0]'
      }`}
    >
      {/* Custom 20x20px Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Complete "${task.title}"`}
        onClick={() => onToggleComplete(task.id)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-colors ${
          task.completed
            ? 'border-[#10B981] bg-[#10B981] text-white'
            : 'border-[#CBD5E1] bg-white hover:border-[#4F46E5] hover:bg-[#EEF2FF]'
        }`}
      >
        {task.completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />}
      </button>

      {/* Main Content Area (opens drawer on click) */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenDetail(task.id)}
            className={`text-left text-[0.9375rem] font-medium leading-snug transition-opacity ${
              task.completed
                ? 'line-through opacity-50 text-[#94A3B8]'
                : 'text-[#0F172A] hover:text-[#3525CD]'
            }`}
          >
            {task.title}
          </button>

          {/* Semantic Status Signaling (color + icon + explicit text label) */}
          {overdue && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#FECDD3] bg-[#FEF2F2] px-2 py-0.5 text-[11px] font-medium text-[#DC2626] whitespace-nowrap">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              Overdue
            </span>
          )}
          {!overdue && !task.completed && task.priority === TaskPriority.Urgent && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-2 py-0.5 text-[11px] font-medium text-[#D97706] whitespace-nowrap">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Urgent
            </span>
          )}
          {!overdue && !task.completed && task.priority === TaskPriority.High && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#FECDD3] bg-[#FEF2F2] px-2 py-0.5 text-[11px] font-medium text-[#DC2626] whitespace-nowrap">
              High Priority
            </span>
          )}
        </div>

        {/* Clean Unboxed Metadata with Typographic Separators */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#64748B]">
          <span className="font-medium text-[#475569]">{project.name}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{formatDurationLabel(task.estimateMinutes)}</span>
          <span aria-hidden="true">·</span>
          <span className={overdue ? 'font-medium text-[#DC2626]' : ''}>
            Due {formatDueDateLabel(task.dueDate)}
          </span>
          {task.subtasks.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {completedSubtasks}/{task.subtasks.length} subtasks
              </span>
            </>
          )}
        </div>
      </div>

      {/* 32x32px Icon Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {!task.completed && (
          <button
            type="button"
            onClick={() => onFocusTask(task.id)}
            title="Start Focus Session"
            aria-label={`Focus on "${task.title}"`}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[#94A3B8] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-all"
          >
            <Crosshair className="h-4 w-4" aria-hidden="true" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onToggleStar(task.id)}
          title={task.starred ? 'Remove priority star' : 'Star task'}
          aria-label={task.starred ? `Unstar "${task.title}"` : `Star "${task.title}"`}
          className={`flex h-8 w-8 items-center justify-center rounded-[6px] transition-colors ${
            task.starred
              ? 'text-[#F59E0B] hover:bg-[#FFFBEB]'
              : 'text-[#94A3B8] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 hover:bg-[#F1F5F9] hover:text-[#0F172A]'
          }`}
        >
          <Star
            className={`h-4 w-4 ${task.starred ? 'fill-[#F59E0B]' : ''}`}
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={() => onDeleteTask(task.id)}
          title="Delete task"
          aria-label={`Delete "${task.title}"`}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[#94A3B8] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-all"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
