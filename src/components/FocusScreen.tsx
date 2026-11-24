import { useEffect, useState } from 'react';
import {
  Check,
  Pause,
  Play,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Task, WorkspaceScreen } from '../types';
import {
  formatClock,
  formatDueDateLabel,
  formatDurationLabel,
  getProjectMeta,
  isTaskOverdue,
} from '../utils/taskHelpers';

interface FocusScreenProps {
  tasks: Task[];
  focusedTaskId: string | null;
  onSelectFocusTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onUpdateTask: (taskId: string, patch: Partial<Task>) => void;
  onNavigate: (screen: WorkspaceScreen) => void;
}

const PRESETS = [
  { label: '15m Sprint', minutes: 15 },
  { label: '25m Focus', minutes: 25 },
  { label: '50m Deep', minutes: 50 },
];

export function FocusScreen({
  tasks,
  focusedTaskId,
  onSelectFocusTask,
  onToggleComplete,
  onUpdateTask,
  onNavigate,
}: FocusScreenProps) {
  const activeTasks = tasks.filter((t) => !t.completed);
  const currentTask =
    activeTasks.find((t) => t.id === focusedTaskId) ?? activeTasks[0] ?? null;

  const [presetMinutes, setPresetMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  const handleSelectPreset = (minutes: number) => {
    setIsRunning(false);
    setPresetMinutes(minutes);
    setSecondsLeft(minutes * 60);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(presetMinutes * 60);
  };

  const handleCompleteAndAdvance = () => {
    if (!currentTask) return;
    const remaining = activeTasks.filter((t) => t.id !== currentTask.id);
    onToggleComplete(currentTask.id);
    if (remaining.length > 0) {
      onSelectFocusTask(remaining[0].id);
    }
    setIsRunning(false);
    setSecondsLeft(presetMinutes * 60);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (!currentTask) return;
    onUpdateTask(currentTask.id, {
      subtasks: currentTask.subtasks.map((s) =>
        s.id === subtaskId ? { ...s, completed: !s.completed } : s
      ),
    });
  };

  const totalSeconds = presetMinutes * 60;
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  if (!currentTask) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-10 shadow-clarity-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981]">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-[-0.015em] text-[#0F172A]">
            All active tasks cleared
          </h2>
          <p className="mt-2 text-sm text-[#475569]">
            Your focus queue is empty. Capture a new task or review completed work in Today.
          </p>
          <button
            type="button"
            onClick={() => onNavigate(WorkspaceScreen.Tasks)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4338CA]"
          >
            Return to Today
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  const project = getProjectMeta(currentTask.projectId);
  const overdue = isTaskOverdue(currentTask);

  return (
    <div className="space-y-6">
      {/* Header + Duration Segmented Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#0F172A]">
            Focus Mode
          </h1>
          <p className="mt-1 text-sm text-[#475569]">
            Single-task execution without inbox distractions.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Focus session duration"
          className="inline-flex items-center gap-1 self-start rounded-lg bg-[#F1F5F9] p-1"
        >
          {PRESETS.map((preset) => {
            const active = presetMinutes === preset.minutes;
            return (
              <button
                key={preset.minutes}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleSelectPreset(preset.minutes)}
                className={`rounded-md px-3 py-1.5 text-xs transition-all whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#FFFFFF] font-semibold text-[#0F172A] shadow-xs'
                    : 'font-medium text-[#64748B] hover:text-[#334155]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Focus Workspace Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Active Execution Card */}
        <section className="lg:col-span-8 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 sm:p-8 shadow-clarity-1">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-[#F1F5F9] pb-6">
            {/* Circular Countdown Clock */}
            <div className="flex items-center gap-5">
              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128" aria-hidden="true">
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="6"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke={secondsLeft === 0 ? '#10B981' : '#4F46E5'}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-[stroke-dashoffset] duration-300"
                  />
                </svg>
                <span className="absolute font-mono text-2xl font-semibold tracking-tight text-[#0F172A] tabular-nums">
                  {formatClock(secondsLeft)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-[#64748B]">
                  {isRunning ? 'Session in progress' : secondsLeft === 0 ? 'Session complete' : 'Ready to focus'}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRunning((r) => !r)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4338CA] whitespace-nowrap"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" aria-hidden="true" />
                        {secondsLeft < totalSeconds ? 'Resume' : 'Start Timer'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetTimer}
                    aria-label="Reset timer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompleteAndAdvance}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-2.5 text-xs font-semibold text-[#059669] transition-colors hover:bg-[#D1FAE5] whitespace-nowrap shrink-0"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Complete & Next
            </button>
          </div>

          {/* Focused Task Details */}
          <div className="pt-6 space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                <span className="font-semibold text-[#3525CD]">{project.name}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {formatDurationLabel(currentTask.estimateMinutes)}
                </span>
                <span aria-hidden="true">·</span>
                <span className={overdue ? 'font-medium text-[#DC2626]' : ''}>
                  Due {formatDueDateLabel(currentTask.dueDate)}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.015em] text-[#0F172A]">
                {currentTask.title}
              </h2>
            </div>

            {/* Subtasks Checklist */}
            {currentTask.subtasks.length > 0 && (
              <div className="space-y-2 border-t border-[#F1F5F9] pt-5">
                <div className="flex items-center justify-between text-xs font-medium text-[#64748B]">
                  <span>Checklist</span>
                  <span className="font-mono tabular-nums">
                    {currentTask.subtasks.filter((s) => s.completed).length}/
                    {currentTask.subtasks.length}
                  </span>
                </div>
                <div className="divide-y divide-[#F1F5F9]">
                  {currentTask.subtasks.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleToggleSubtask(sub.id)}
                      className="flex w-full items-center gap-3 py-2.5 text-left transition-colors hover:bg-[#F8FAFC] px-1 rounded-md"
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
                        className={`text-sm ${
                          sub.completed
                            ? 'line-through text-[#94A3B8]'
                            : 'text-[#0F172A]'
                        }`}
                      >
                        {sub.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scratchpad Notes */}
            <div className="border-t border-[#F1F5F9] pt-5">
              <label
                htmlFor="focus-scratchpad"
                className="block text-xs font-semibold text-[#475569]"
              >
                Session Notes
              </label>
              <textarea
                id="focus-scratchpad"
                rows={4}
                value={currentTask.notes}
                onChange={(e) =>
                  onUpdateTask(currentTask.id, { notes: e.target.value })
                }
                placeholder="Jot down progress, edge cases, or next handoff notes..."
                className="mt-2 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 text-sm leading-relaxed text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-[#FFFFFF] focus:border-[#4F46E5] focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Up Next Queue */}
        <aside className="lg:col-span-4 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-clarity-1">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <h3 className="text-sm font-semibold text-[#0F172A]">Up Next</h3>
            <span className="font-mono text-xs text-[#64748B] tabular-nums">
              {activeTasks.length} active
            </span>
          </div>

          <div className="mt-2 divide-y divide-[#F1F5F9]">
            {activeTasks.slice(0, 6).map((task) => {
              const selected = task.id === currentTask.id;
              const taskProject = getProjectMeta(task.projectId);
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onSelectFocusTask(task.id)}
                  className={`flex w-full flex-col items-start gap-1 py-3 px-2 text-left rounded-lg transition-colors ${
                    selected ? 'bg-[#EEF2FF]' : 'hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span
                    className={`line-clamp-1 text-sm font-medium ${
                      selected ? 'text-[#3525CD]' : 'text-[#0F172A]'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    {taskProject.name} ·{' '}
                    <span className="font-mono tabular-nums">
                      {formatDurationLabel(task.estimateMinutes)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
