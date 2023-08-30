export interface Todo {
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

export interface NewTodoItem {
  date: string;
  dayOfWeek: string;
  day: string;
  tasks: Todo[]; // 이미 이전에 Todo 타입을 정의해두었습니다.
}

export interface NewTask {
  workspaceId?: number;
  title: Record<string, string>;
  date: string;
  priority?: number;
  status?: boolean;
}

export interface CurrentDate {
  dayofWeek: string;
  day: string;
  formatDate: string;
}
