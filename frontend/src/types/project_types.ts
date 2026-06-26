// Project types
export interface ProjectBase {
  id: number;
  name: string;
  description: string;
  created_at: string;
  owner_id: number;
  _optimistic?: boolean; // Used for temporary projects during optimistic updates
}

export type ProjectUpdate = Partial<Omit<ProjectBase, 'id' | 'created_at' | 'owner_id'>>;

export type ProjectCreate = Omit<ProjectBase, 'id' | 'created_at' | 'owner_id'>;

export interface ProjectModalProps {
  project?: ProjectBase | null;
  onSave: (data: ProjectCreate | ProjectUpdate) => void;
  onClose: () => void;
  isSaving?: boolean; // Optional prop to indicate saving state
}

export interface ProjectCardProps {
  project: ProjectBase;
  onEdit: (project: ProjectBase) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean; // Optional prop to indicate deletion state
}