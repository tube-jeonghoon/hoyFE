interface Todo {
  id: number;
  title: string;
  scheduleDate: string;
  status: boolean;
  priority: number;
  updatedAt: string;
  createdAt: string;
  commentCount: number;
  dueDate: string;
  deletedAt: string;
}

interface NewTodoItem {
  date: string;
  dayOfWeek: string;
  day: string;
  tasks: Todo[];
}

interface NewTask {
  workspaceId?: number;
  title: Record<string, string>;
  date: string;
  priority?: number;
  status?: boolean;
}

interface CurrentDate {
  dayofWeek: string;
  day: string;
  formatDate: string;
}

export type { Todo, NewTodoItem, NewTask, CurrentDate };
