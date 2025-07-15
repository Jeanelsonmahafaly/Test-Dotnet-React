import {
  User,
  Task,
  TaskWithHistory,
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  AssignTaskRequest,
  API_BASE_URL
} from '@/types/api';

class ApiService {
  private  baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://api.monsite.com' 
  : 'http://localhost:5000';

  // Méthode générique pour appeler l'API
  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API : ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // 🔹 Utilisateurs
  async getUsers(): Promise<User[]> {
    return this.fetchApi<User[]>('/api/Users');
  }

  // 🔹 Tâches
  async getTasks(): Promise<Task[]> {
    return this.fetchApi<Task[]>('/api/Tasks');
  }

  async getTaskWithHistory(id: string): Promise<TaskWithHistory> {
    return this.fetchApi<TaskWithHistory>(`/api/Tasks/${id}`);
  }

  async createTask(request: CreateTaskRequest): Promise<Task> {
    return this.fetchApi<Task>('/api/Tasks', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateTaskStatus(id: string, request: UpdateTaskStatusRequest): Promise<Task> {
    return this.fetchApi<Task>(`/api/Tasks/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  async assignTask(id: string, request: AssignTaskRequest): Promise<Task> {
    return this.fetchApi<Task>(`/api/Tasks/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  // (Facultatif) Suppression d’une tâche
  async deleteTask(id: string): Promise<void> {
    await this.fetchApi<void>(`/api/Tasks/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
