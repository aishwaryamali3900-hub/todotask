import { PROJECTS, TODAY_ISO } from '../data/initialTasks';
import { ProjectId, ProjectMeta, Task, TaskPriority } from '../types';

export function getProjectMeta(projectId: ProjectId): ProjectMeta {
  return PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0];
}

export function isTaskOverdue(task: Task): boolean {
  if (task.completed) return false;
  return task.dueDate < TODAY_ISO;
}

export function formatDueDateLabel(dueDate: string): string {
  if (dueDate === TODAY_ISO) return 'Today';
  if (dueDate === '2026-11-25') return 'Tomorrow';
  if (dueDate === '2026-11-23') return 'Yesterday';

  const parsed = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dueDate;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDurationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function getPriorityLabel(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.High:
      return 'High Priority';
    case TaskPriority.Urgent:
      return 'Pending Urgent';
    default:
      return 'Standard';
  }
}

export function formatClock(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
