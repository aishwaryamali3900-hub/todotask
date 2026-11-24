export enum WorkspaceScreen {
  Tasks = 'tasks',
  Focus = 'focus',
  Projects = 'projects',
  Insights = 'insights',
}

export enum TaskStatusFilter {
  All = 'all',
  Pending = 'pending',
  Completed = 'completed',
  Overdue = 'overdue',
}

export enum TaskPriority {
  Normal = 'normal',
  Urgent = 'urgent',
  High = 'high',
}

export enum ProjectId {
  Engineering = 'engineering',
  Design = 'design',
  Product = 'product',
  Operations = 'operations',
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  dueDate: string; // YYYY-MM-DD
  estimateMinutes: number;
  projectId: ProjectId;
  priority: TaskPriority;
  starred: boolean;
  subtasks: Subtask[];
}

export interface ProjectMeta {
  id: ProjectId;
  name: string;
  description: string;
  owner: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  tone: 'success' | 'info' | 'danger';
  undoAction?: () => void;
}
