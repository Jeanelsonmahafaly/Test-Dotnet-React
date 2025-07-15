// Types pour l'API Backend (.NET)

export enum ChangeType {
  Creation = 'Creation',
  StatusChange = 'StatusChange',
  AssignmentChange = 'AssignmentChange'
}

export interface User {
  id: string;
  userName: string;
}

export enum TaskStatus {
  ToDo = 0,
  InProgress = 1,
  Done = 2,
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedToUserId?: string | null;
  assignedTo?: {
    id: string;
    userName: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  changedByUserId: string;
  changedBy?: User;
  changeType: ChangeType;
  oldValue?: string;
  newValue?: string;
  changeDate: string;
}

export interface TaskWithHistory {
  task: Task;
  history: TaskHistory[];
}

// DTOs pour les requêtes API
export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignedToUserId?: string;
  createdByUserId: string;
}

export interface UpdateTaskStatusRequest {
  newStatus: TaskStatus;
  changedByUserId: string;
}

export interface AssignTaskRequest {
  assignedToUserId?: string | null;
  changedByUserId: string;
}


type AssignTaskWrapper = {
 
};

// Configuration API
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.monsite.com' 
  : 'http://localhost:5000';

export const USE_MOCK_API = false;

// Status transitions validation
export const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.ToDo]: [TaskStatus.InProgress],
  [TaskStatus.InProgress]: [TaskStatus.Done, TaskStatus.ToDo],
  [TaskStatus.Done]: [TaskStatus.InProgress]
};

// Utilitaires pour les statuts
export const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.ToDo:
      return 'À Faire';
    case TaskStatus.InProgress:
      return 'En Cours';
    case TaskStatus.Done:
      return 'Terminé';
    default:
      return 'Inconnu';
  }
};

export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.ToDo:
      return 'bg-slate-100 text-slate-800';
    case TaskStatus.InProgress:
      return 'bg-blue-100 text-blue-800';
    case TaskStatus.Done:
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


// Validation des transitions
export const isValidTransition = (fromStatus: TaskStatus, toStatus: TaskStatus): boolean => {
  return VALID_TRANSITIONS[fromStatus]?.includes(toStatus) ?? false;
};

// Types pour les réponses d'erreur de l'API
export interface ApiError {
  message: string;
  statusCode: number;
  details?: string;
}

// Interface pour la réponse API générique
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// Types pour la pagination (si nécessaire plus tard)
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}