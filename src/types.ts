export type ColumnId = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  column: ColumnId;
  position: number;
  created_at: string;
}
