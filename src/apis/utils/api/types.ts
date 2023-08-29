interface NewTask {
  workspaceId?: number;
  title: Record<string, string>;
  date: string;
  priority?: number;
  status?: boolean;
}

export type { NewTask };
