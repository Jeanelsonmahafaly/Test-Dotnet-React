import { 
  User, 
  Task, 
  TaskWithHistory, 
  CreateTaskRequest, 
  UpdateTaskStatusRequest, 
  AssignTaskRequest,
  TaskStatus,
  ChangeType,
  TaskHistory,
  VALID_TRANSITIONS
} from '@/types/api';

// Données mock pour la démonstration
const mockUsers: User[] = [
  { id: 1, userName: "John Doe" },
  { id: 2, userName: "Jane Smith" },
  { id: 3, userName: "Bob Johnson" }
];

let mockTasks: Task[] = [
  {
    id: 1,
    title: "Analyser les requirements",
    description: "Analyser les besoins fonctionnels du projet",
    status: TaskStatus.Done,
    assignedToUserId: 1,
    assignedTo: mockUsers[0],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    title: "Développer l'API Backend",
    description: "Créer les endpoints REST pour la gestion des tâches",
    status: TaskStatus.InProgress,
    assignedToUserId: 2,
    assignedTo: mockUsers[1],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: "Intégrer le Frontend",
    description: "Connecter React à l'API backend",
    status: TaskStatus.ToDo,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let mockTaskHistory: TaskHistory[] = [
  {
    id: 1,
    taskId: 1,
    changedByUserId: 1,
    changedBy: mockUsers[0],
    changeType: ChangeType.Creation,
    newValue: "ToDo",
    changeDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    taskId: 1,
    changedByUserId: 1,
    changedBy: mockUsers[0],
    changeType: ChangeType.StatusChange,
    oldValue: "ToDo",
    newValue: "InProgress",
    changeDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    taskId: 1,
    changedByUserId: 1,
    changedBy: mockUsers[0],
    changeType: ChangeType.StatusChange,
    oldValue: "InProgress",
    newValue: "Done",
    changeDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let nextTaskId = 4;
let nextHistoryId = 4;

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const findUserById = (id: number): User | undefined => {
  return mockUsers.find(u => u.id === id);
};

const validateStatusTransition = (currentStatus: TaskStatus, newStatus: TaskStatus): boolean => {
  const validTransitions = VALID_TRANSITIONS[currentStatus];
  return validTransitions.includes(newStatus);
};

// Mock API Service
export class MockApiService {
  // Users endpoints
  async getUsers(): Promise<User[]> {
    await delay(300); // Simulate network delay
    return [...mockUsers];
  }

  // Tasks endpoints
  async getTasks(): Promise<Task[]> {
    await delay(500); // Simulate network delay
    return mockTasks.map(task => ({
      ...task,
      assignedTo: task.assignedToUserId ? findUserById(task.assignedToUserId) : undefined
    }));
  }

  async getTaskWithHistory(id: number): Promise<TaskWithHistory> {
    await delay(400);
    
    const task = mockTasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    const history = mockTaskHistory
      .filter(h => h.taskId === id)
      .sort((a, b) => new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime());

    return {
      task: {
        ...task,
        assignedTo: task.assignedToUserId ? findUserById(task.assignedToUserId) : undefined
      },
      history
    };
  }

  async createTask(request: CreateTaskRequest): Promise<Task> {
    await delay(600);
    
    // Validate creator exists
    const creator = findUserById(request.createdByUserId);
    if (!creator) {
      throw new Error("Creator user not found");
    }

    // Validate assigned user if provided
    if (request.assignedToUserId) {
      const assignedUser = findUserById(request.assignedToUserId);
      if (!assignedUser) {
        throw new Error("Assigned user not found");
      }
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      id: nextTaskId++,
      title: request.title,
      description: request.description,
      status: TaskStatus.ToDo,
      assignedToUserId: request.assignedToUserId,
      assignedTo: request.assignedToUserId ? findUserById(request.assignedToUserId) : undefined,
      createdAt: now,
      updatedAt: now
    };

    mockTasks.push(newTask);

    // Add creation history
    const history: TaskHistory = {
      id: nextHistoryId++,
      taskId: newTask.id,
      changedByUserId: request.createdByUserId,
      changedBy: creator,
      changeType: ChangeType.Creation,
      newValue: TaskStatus.ToDo,
      changeDate: now
    };

    mockTaskHistory.push(history);

    return newTask;
  }

  async updateTaskStatus(id: number, request: UpdateTaskStatusRequest): Promise<Task> {
    await delay(400);
    
    const task = mockTasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    // Validate user exists
    const user = findUserById(request.changedByUserId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate transition
    if (!validateStatusTransition(task.status, request.newStatus)) {
      throw new Error(`Invalid status transition from ${task.status} to ${request.newStatus}`);
    }

    const oldStatus = task.status;
    task.status = request.newStatus;
    task.updatedAt = new Date().toISOString();

    // Add history
    const history: TaskHistory = {
      id: nextHistoryId++,
      taskId: task.id,
      changedByUserId: request.changedByUserId,
      changedBy: user,
      changeType: ChangeType.StatusChange,
      oldValue: oldStatus,
      newValue: request.newStatus,
      changeDate: new Date().toISOString()
    };

    mockTaskHistory.push(history);

    return {
      ...task,
      assignedTo: task.assignedToUserId ? findUserById(task.assignedToUserId) : undefined
    };
  }

  async assignTask(id: number, request: AssignTaskRequest): Promise<Task> {
    await delay(400);
    
    const task = mockTasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    // Validate changer exists
    const changer = findUserById(request.changedByUserId);
    if (!changer) {
      throw new Error("Changer user not found");
    }

    // Validate assigned user if provided
    if (request.assignedToUserId) {
      const assignedUser = findUserById(request.assignedToUserId);
      if (!assignedUser) {
        throw new Error("Assigned user not found");
      }
    }

    const oldAssigneeId = task.assignedToUserId;
    task.assignedToUserId = request.assignedToUserId;
    task.updatedAt = new Date().toISOString();

    // Add history
    const history: TaskHistory = {
      id: nextHistoryId++,
      taskId: task.id,
      changedByUserId: request.changedByUserId,
      changedBy: changer,
      changeType: ChangeType.AssignmentChange,
      oldValue: oldAssigneeId?.toString(),
      newValue: request.assignedToUserId?.toString(),
      changeDate: new Date().toISOString()
    };

    mockTaskHistory.push(history);

    return {
      ...task,
      assignedTo: task.assignedToUserId ? findUserById(task.assignedToUserId) : undefined
    };
  }
}

export const mockApiService = new MockApiService();