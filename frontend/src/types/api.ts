// Types pour l'API Backend (.NET)

export enum TaskStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Done = 'Done'
}

export enum ChangeType {
  Creation = 'Creation',
  StatusChange = 'StatusChange',
  AssignmentChange = 'AssignmentChange'
}

export interface User {
  id: number;
  userName: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedToUserId?: number;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TaskHistory {
  id: number;
  taskId: number;
  changedByUserId: number;
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
  assignedToUserId?: number;
  createdByUserId: number;
}

export interface UpdateTaskStatusRequest {
  newStatus: TaskStatus;
  changedByUserId: number;
}

export interface AssignTaskRequest {
  assignedToUserId?: number;
  changedByUserId: number;
}

// Configuration API
export const API_BASE_URL = 'https://localhost:7001'; // URL du backend .NET
export const USE_MOCK_API = true; // Changer en false quand le backend est disponible

// Status transitions validation
export const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.ToDo]: [TaskStatus.InProgress],
  [TaskStatus.InProgress]: [TaskStatus.Done, TaskStatus.ToDo],
  [TaskStatus.Done]: [TaskStatus.InProgress]
};