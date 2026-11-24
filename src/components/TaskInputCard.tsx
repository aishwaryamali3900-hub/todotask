import { FormEvent, RefObject, useState } from 'react';
import { ArrowUp, Calendar, Clock, Flag, Folder } from 'lucide-react';
import { PROJECTS, TODAY_ISO } from '../data/initialTasks';
import { ProjectId, TaskPriority } from '../types';

interface TaskInputCardProps {
  inputRef?: RefObject<HTMLInputElement | null>;
  defaultProjectId?: ProjectId;
  onAddTask: (payload: {
    title: string;
    projectId: ProjectId;
    priority: TaskPriority;
    dueDate: string;
    estimateMinutes: number;
  }) => void;
  placeholder?: string;
}

export function TaskInputCard({
  inputRef,
  defaultProjectId = ProjectId.Engineering,
  onAddTask,
  placeholder = 'Capture a task... (Press / to focus, Enter to save)',
}: TaskInputCardProps) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState<ProjectId>(defaultProjectId);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Normal);
  const [dueDate, setDueDate] = useState<string>(TODAY_ISO);
  const [estimateMinutes, setEstimateMinutes] = useState<number>(30);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAddTask({
      title: trimmed,
      projectId,
      priority,
      dueDate,
      estimateMinutes,
    });
    setTitle('');
    setPriority(TaskPriority.Normal);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 shadow-clarity-1 transition-shadow focus-within:border-[#4F46E5]/50 focus-within:shadow-clarity-2"
    >
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
          aria-label="New task title"
          className="w-full bg-transparent text-[0.9375rem] font-normal text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus-visible:shadow-none"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          aria-label="Add task"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4F46E5] text-white transition-colors hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:bg-[#E2E8F0] disabled:text-[#94A3B8]"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F1F5F9] pt-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Project Picker */}
          <label className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#475569] hover:border-[#CBD5E1] transition-colors">
            <Folder className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden="true" />
            <span className="sr-only">Project</span>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value as ProjectId)}
              aria-label="Project stream"
              className="bg-transparent text-xs font-medium text-[#334155] focus:outline-none focus-visible:shadow-none cursor-pointer"
            >
              {PROJECTS.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>

          {/* Priority Picker */}
          <label className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#475569] hover:border-[#CBD5E1] transition-colors">
            <Flag className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden="true" />
            <span className="sr-only">Priority</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              aria-label="Task priority"
              className="bg-transparent text-xs font-medium text-[#334155] focus:outline-none focus-visible:shadow-none cursor-pointer"
            >
              <option value={TaskPriority.Normal}>Standard</option>
              <option value={TaskPriority.Urgent}>Urgent</option>
              <option value={TaskPriority.High}>High Priority</option>
            </select>
          </label>

          {/* Due Date Picker */}
          <label className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#475569] hover:border-[#CBD5E1] transition-colors">
            <Calendar className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden="true" />
            <span className="sr-only">Due date</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
              className="bg-transparent font-mono text-xs text-[#334155] focus:outline-none focus-visible:shadow-none cursor-pointer"
            />
          </label>

          {/* Estimate Picker */}
          <label className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#475569] hover:border-[#CBD5E1] transition-colors">
            <Clock className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden="true" />
            <span className="sr-only">Estimated duration</span>
            <select
              value={estimateMinutes}
              onChange={(e) => setEstimateMinutes(Number(e.target.value))}
              aria-label="Estimated duration"
              className="bg-transparent font-mono text-xs text-[#334155] focus:outline-none focus-visible:shadow-none cursor-pointer"
            >
              <option value={15}>15m</option>
              <option value={30}>30m</option>
              <option value={45}>45m</option>
              <option value={60}>60m</option>
              <option value={90}>90m</option>
            </select>
          </label>
        </div>

        <span className="hidden sm:inline font-mono text-[11px] text-[#94A3B8]">
          Enter to create
        </span>
      </div>
    </form>
  );
}
