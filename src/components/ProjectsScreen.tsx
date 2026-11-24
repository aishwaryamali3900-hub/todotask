import { FormEvent, useState } from 'react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { PROJECTS, TODAY_ISO } from '../data/initialTasks';
import { ProjectId, Task, TaskPriority } from '../types';
import { formatDueDateLabel, isTaskOverdue } from '../utils/taskHelpers';

interface ProjectsScreenProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onOpenDetail: (taskId: string) => void;
  onAddTask: (payload: {
    title: string;
    projectId: ProjectId;
    priority: TaskPriority;
    dueDate: string;
    estimateMinutes: number;
  }) => void;
  onFilterInInbox: (projectId: ProjectId) => void;
}

export function ProjectsScreen({
  tasks,
  onToggleComplete,
  onOpenDetail,
  onAddTask,
  onFilterInInbox,
}: ProjectsScreenProps) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const handleQuickAdd = (e: FormEvent, projectId: ProjectId) => {
    e.preventDefault();
    const title = (drafts[projectId] ?? '').trim();
    if (!title) return;
    onAddTask({
      title,
      projectId,
      priority: TaskPriority.Normal,
      dueDate: TODAY_ISO,
      estimateMinutes: 30,
    });
    setDrafts((prev) => ({ ...prev, [projectId]: '' }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#0F172A]">
          Project Streams
        </h1>
        <p className="mt-1 text-sm text-[#475569]">
          Track execution progress and capture work directly inside each active stream.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {PROJECTS.map((project) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const completedCount = projectTasks.filter((t) => t.completed).length;
          const totalCount = projectTasks.length;
          const pct =
            totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          // Sort pending first, then completed
          const sorted = [...projectTasks].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return a.dueDate.localeCompare(b.dueDate);
          });

          return (
            <section
              key={project.id}
              className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-clarity-1"
            >
              <div>
                {/* Stream Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-[#0F172A]">
                      {project.name}
                    </h2>
                    <p className="mt-1 text-xs text-[#64748B]">
                      {project.owner} · {project.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onFilterInInbox(project.id)}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors whitespace-nowrap shrink-0"
                  >
                    View all
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#475569]">Completion</span>
                    <span className="font-mono text-[#0F172A] tabular-nums">
                      {completedCount}/{totalCount} ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct === 100 && totalCount > 0 ? 'bg-[#10B981]' : 'bg-[#4F46E5]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Task Rows (Hairline separated, no nested cards) */}
                <div className="mt-4 divide-y divide-[#F1F5F9] border-t border-[#F1F5F9]">
                  {sorted.length === 0 ? (
                    <p className="py-5 text-center text-xs text-[#94A3B8]">
                      No tasks in {project.name} yet.
                    </p>
                  ) : (
                    sorted.slice(0, 5).map((task) => {
                      const overdue = isTaskOverdue(task);
                      return (
                        <div
                          key={task.id}
                          className="flex items-center justify-between gap-3 py-2.5"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={task.completed}
                              aria-label={`Toggle "${task.title}"`}
                              onClick={() => onToggleComplete(task.id)}
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-colors ${
                                task.completed
                                  ? 'border-[#10B981] bg-[#10B981] text-white'
                                  : 'border-[#CBD5E1] bg-white hover:border-[#4F46E5]'
                              }`}
                            >
                              {task.completed && (
                                <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenDetail(task.id)}
                              className={`truncate text-left text-sm transition-colors ${
                                task.completed
                                  ? 'line-through opacity-50 text-[#94A3B8]'
                                  : 'text-[#0F172A] hover:text-[#3525CD]'
                              }`}
                            >
                              {task.title}
                            </button>
                          </div>
                          <span
                            className={`shrink-0 font-mono text-[11px] tabular-nums ${
                              overdue ? 'font-medium text-[#DC2626]' : 'text-[#94A3B8]'
                            }`}
                          >
                            {formatDueDateLabel(task.dueDate)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Inline Stream Quick Add */}
              <form
                onSubmit={(e) => handleQuickAdd(e, project.id)}
                className="mt-4 flex items-center gap-2 border-t border-[#F1F5F9] pt-4"
              >
                <input
                  type="text"
                  value={drafts[project.id] ?? ''}
                  onChange={(e) =>
                    setDrafts((prev) => ({ ...prev, [project.id]: e.target.value }))
                  }
                  placeholder={`Add task to ${project.name}...`}
                  aria-label={`Add task to ${project.name}`}
                  className="flex-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:bg-[#FFFFFF] focus:border-[#4F46E5] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!(drafts[project.id] ?? '').trim()}
                  aria-label={`Create task in ${project.name}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#4F46E5] text-white transition-colors hover:bg-[#4338CA] disabled:bg-[#E2E8F0] disabled:text-[#94A3B8]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </section>
          );
        })}
      </div>
    </div>
  );
}
