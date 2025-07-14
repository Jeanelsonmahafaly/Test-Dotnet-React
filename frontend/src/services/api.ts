import { 
  User, 
  Task, 
  TaskWithHistory, 
  CreateTaskRequest, 
  UpdateTaskStatusRequest, 
  AssignTaskRequest,
  API_BASE_URL,
  USE_MOCK_API
} from '@/types/api';
import { mockApiService } from './mockApi';

class ApiService {
  private baseUrl = API_BASE_URL;

  // Helper method for API calls
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
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // Users endpoints
  async getUsers(): Promise<User[]> {
    if (USE_MOCK_API) {
      return mockApiService.getUsers();
    }
    return this.fetchApi<User[]>('/api/users');
  }

  // Tasks endpoints
  async getTasks(): Promise<Task[]> {
    if (USE_MOCK_API) {
      return mockApiService.getTasks();
    }
    return this.fetchApi<Task[]>('/api/tasks');
  }

  async getTaskWithHistory(id: number): Promise<TaskWithHistory> {
    if (USE_MOCK_API) {
      return mockApiService.getTaskWithHistory(id);
    }
    return this.fetchApi<TaskWithHistory>(`/api/tasks/${id}`);
  }

  async createTask(request: CreateTaskRequest): Promise<Task> {
    if (USE_MOCK_API) {
      return mockApiService.createTask(request);
    }
    return this.fetchApi<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateTaskStatus(id: number, request: UpdateTaskStatusRequest): Promise<Task> {
    if (USE_MOCK_API) {
      return mockApiService.updateTaskStatus(id, request);
    }
    return this.fetchApi<Task>(`/api/tasks/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  async assignTask(id: number, request: AssignTaskRequest): Promise<Task> {
    if (USE_MOCK_API) {
      return mockApiService.assignTask(id, request);
    }
    return this.fetchApi<Task>(`/api/tasks/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }
}

export const apiService = new ApiService();