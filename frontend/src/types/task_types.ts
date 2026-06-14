type TaskStatus = 'todo' | 'in_progress' | 'done';

type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskBase {
  id: number;
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string; // ISO date string
  project_id: number;
  created_at: string; // ISO date string
}

export type TaskCreate = Omit<TaskBase, 'id' | 'created_at' | 'project_id'>;

export type TaskUpdate = Partial<Omit<TaskBase, 'id' | 'created_at' | 'project_id'>>;