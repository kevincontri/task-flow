export interface CommentBase {
  id: number;
  content: string;
  created_at: string;
  task_id: number;
  author_id: number;
  _optimistic?: boolean; // Optional property to indicate if the comment is in an optimistic state
}

export type CommentCreate = Omit<CommentBase, 'id' | 'created_at' | 'task_id' | 'author_id'>;