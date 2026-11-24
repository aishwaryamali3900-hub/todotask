import { PROJECTS } from '../data/initialTasks';
import { Task, WorkspaceScreen } from '../types';
import { formatDurationLabel, isTaskOverdue } from '../utils/taskHelpers';

interface InsightsScreenProps {
  tasks: Task[];
  onOpenDetail: (taskId: string) => void;
  onNavigate: (screen: WorkspaceScreen) => void;
}

const WEEK_DAYS = [
  { date: '2026-11-18', label: 'Wed' },
  { date: '2026-11-19', label: 'Thu' },
  { date: '2026-11-20', label: 'Fri' },
  { date: '2026-11-21', label: 'Sat' },
  { date: '2026-11-22', label: 'Sun' },
  { date: '2026-11-23', label: 'Mon' },
  { date: '2026-11-24', label: 'Today' },
];

export function InsightsScreen({
  tasks,
  onOpenDetail,
  onNavigate,
}: InsightsScreenProps) {
  const totalCount = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const overdueTasks = tasks.filter((t) => isTaskOverdue(t));

  const completionRate =
    totalCount > 0 ? Math.round((completedTasks.length / totalCount) * 100) : 0;

  const remainingMinutes = pendingTasks.reduce(
    (sum, t) => sum + t.estimateMinutes,
    0
  );

  // Compute completions per day across the 7-day window
  const dailyCounts = WEEK_DAYS.map((day) => {
    const count = completedTasks.filter((t) =>
      t.completedAt?.startsWith(day.date)
    ).length;
    return { ...day, count };
  });

  const maxDaily = Math.max(1, ...dailyCounts.map((d) => d.count));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#0F172A]">
            Weekly Review
          </h1>
          <p className="mt-1 text-sm text-[#475569]">
            Live execution summary across active streams and completed milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate(WorkspaceScreen.Focus)}
          className="self-start rounded-lg bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4338CA] whitespace-nowrap"
        >
          Start Focus Session
        </button>
      </div>

      {/* 4-Column Metric Strip (Single Surface, Clean Dividers) */}
      <section
        aria-label="Workspace summary metrics"
        className="grid grid-cols-2 divide-y divide-[#E2E8F0] rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-clarity-1 sm:grid-cols-4 sm:divide-y-0 sm:divide-x"
      >
        <div className="p-5">
          <div className="text-xs font-medium text-[#64748B]">Pending Tasks</div>
          <div className="mt-1.5 font-mono text-2xl font-bold text-[#0F172A] tabular-nums">
            {pendingTasks.length}
          </div>
          <div className="mt-1 text-xs text-[#64748B]">
            {formatDurationLabel(remainingMinutes)} queued
          </div>
        </div>

        <div className="p-5">
          <div className="text-xs font-medium text-[#64748B]">Completed</div>
          <div className="mt-1.5 font-mono text-2xl font-bold text-[#059669] tabular-nums">
            {completedTasks.length}
          </div>
          <div className="mt-1 text-xs text-[#64748B]">
            {completionRate}% of all tasks
          </div>
        </div>

        <div className="p-5">
          <div className="text-xs font-medium text-[#64748B]">Overdue</div>
          <div
            className={`mt-1.5 font-mono text-2xl font-bold tabular-nums ${
              overdueTasks.length > 0 ? 'text-[#DC2626]' : 'text-[#0F172A]'
            }`}
          >
            {overdueTasks.length}
          </div>
          <div className="mt-1 text-xs text-[#64748B]">
            {overdueTasks.length > 0 ? 'Requires rescheduling' : 'On schedule'}
          </div>
        </div>

        <div className="p-5">
          <div className="text-xs font-medium text-[#64748B]">Total Tracked</div>
          <div className="mt-1.5 font-mono text-2xl font-bold text-[#0F172A] tabular-nums">
            {totalCount}
          </div>
          <div className="mt-1 text-xs text-[#64748B]">
            Across {PROJECTS.length} streams
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 7-Day Completion Cadence Chart */}
        <section className="lg:col-span-7 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-clarity-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">
                7-Day Completion Cadence
              </h2>
              <p className="mt-0.5 text-xs text-[#64748B]">
                Tasks marked complete per day (Nov 18 – Nov 24)
              </p>
            </div>
            <span className="font-mono text-xs font-medium text-[#475569] tabular-nums">
              {dailyCounts.reduce((acc, d) => acc + d.count, 0)} completed
            </span>
          </div>

          <div className="mt-8 flex h-44 items-end justify-between gap-3 border-b border-[#E2E8F0] pb-2">
            {dailyCounts.map((day) => {
              const heightPct = Math.round((day.count / maxDaily) * 100);
              const isToday = day.date === '2026-11-24';
              return (
                <div
                  key={day.date}
                  className="flex flex-1 flex-col items-center justify-end gap-2 h-full"
                >
                  <span className="font-mono text-xs font-medium text-[#475569] tabular-nums">
                    {day.count > 0 ? day.count : ''}
                  </span>
                  <div className="flex w-full max-w-[40px] flex-1 items-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        day.count === 0
                          ? 'h-1 bg-[#F1F5F9]'
                          : isToday
                          ? 'bg-[#4F46E5]'
                          : 'bg-[#C7D2FE]'
                      }`}
                      style={
                        day.count > 0
                          ? { height: `${Math.max(14, heightPct)}%` }
                          : undefined
                      }
                      title={`${day.label}: ${day.count} completed`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-3">
            {dailyCounts.map((day) => (
              <span
                key={day.date}
                className={`flex-1 text-center text-xs ${
                  day.date === '2026-11-24'
                    ? 'font-semibold text-[#3525CD]'
                    : 'text-[#64748B]'
                }`}
              >
                {day.label}
              </span>
            ))}
          </div>
        </section>

        {/* Stream Breakdown */}
        <section className="lg:col-span-5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-clarity-1">
          <h2 className="text-base font-semibold text-[#0F172A]">
            Stream Distribution
          </h2>
          <p className="mt-0.5 text-xs text-[#64748B]">
            Completion ratio by project stream
          </p>

          <div className="mt-5 space-y-4">
            {PROJECTS.map((project) => {
              const streamTasks = tasks.filter((t) => t.projectId === project.id);
              const streamDone = streamTasks.filter((t) => t.completed).length;
              const pct =
                streamTasks.length > 0
                  ? Math.round((streamDone / streamTasks.length) * 100)
                  : 0;

              return (
                <div key={project.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#0F172A]">{project.name}</span>
                    <span className="font-mono text-[#64748B] tabular-nums">
                      {streamDone}/{streamTasks.length} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct === 100 && streamTasks.length > 0
                          ? 'bg-[#10B981]'
                          : 'bg-[#4F46E5]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {overdueTasks.length > 0 && (
            <div className="mt-6 border-t border-[#F1F5F9] pt-4">
              <div className="text-xs font-semibold text-[#DC2626]">
                Needs Rescheduling
              </div>
              <div className="mt-2 space-y-1.5">
                {overdueTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => onOpenDetail(task.id)}
                    className="flex w-full items-center justify-between rounded-lg bg-[#FEF2F2] px-3 py-2 text-left text-xs font-medium text-[#991B1B] hover:bg-[#FEE2E2] transition-colors"
                  >
                    <span className="truncate pr-2">{task.title}</span>
                    <span className="font-mono shrink-0 tabular-nums">
                      {task.dueDate}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
