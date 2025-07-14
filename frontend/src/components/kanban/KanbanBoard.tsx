import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types/api';
import { apiService } from '@/services/api';
import { KanbanColumn } from './KanbanColumn';
import { CreateTaskForm } from './CreateTaskForm';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Simulated user ID for this demo
  const CURRENT_USER_ID = 1;

  const loadTasks = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) setRefreshing(true);
      const tasksData = await apiService.getTasks();
      setTasks(tasksData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les tâches",
        variant: "destructive",
      });
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
      if (showRefreshLoader) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Succès",
      description: "Tâche créée avec succès",
    });
  };

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    try {
      const updatedTask = await apiService.updateTaskStatus(taskId, {
        newStatus,
        changedByUserId: CURRENT_USER_ID,
      });

      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? updatedTask : task
        )
      );

      toast({
        title: "Succès",
        description: `Tâche déplacée vers ${getStatusLabel(newStatus)}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
      console.error('Error updating task status:', error);
    }
  };

  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.ToDo:
        return 'À Faire';
      case TaskStatus.InProgress:
        return 'En Cours';
      case TaskStatus.Done:
        return 'Terminé';
      default:
        return status;
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement des tâches...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Task Tracker - Mini Kanban
              </h1>
              <p className="text-muted-foreground">
                Gérez vos tâches avec simplicité et efficacité
              </p>
            </div>
            <Button
              onClick={() => loadTasks(true)}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Actualiser
            </Button>
          </div>
        </div>

        {/* Create Task Form */}
        <Card className="mb-8 p-6 shadow-card">
          <CreateTaskForm 
            onTaskCreated={handleTaskCreated}
            currentUserId={CURRENT_USER_ID}
          />
        </Card>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <KanbanColumn
            title="À Faire"
            status={TaskStatus.ToDo}
            tasks={getTasksByStatus(TaskStatus.ToDo)}
            onStatusChange={handleStatusChange}
            className="bg-gradient-todo border-todo-border"
          />
          
          <KanbanColumn
            title="En Cours"
            status={TaskStatus.InProgress}
            tasks={getTasksByStatus(TaskStatus.InProgress)}
            onStatusChange={handleStatusChange}
            className="bg-gradient-progress border-in-progress-border"
          />
          
          <KanbanColumn
            title="Terminé"
            status={TaskStatus.Done}
            tasks={getTasksByStatus(TaskStatus.Done)}
            onStatusChange={handleStatusChange}
            className="bg-gradient-done border-done-border"
          />
        </div>

        {/* Statistics */}
        <Card className="mt-8 p-6 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-todo/50 rounded-lg">
              <div className="text-2xl font-bold text-todo-accent">
                {getTasksByStatus(TaskStatus.ToDo).length}
              </div>
              <div className="text-sm text-muted-foreground">À Faire</div>
            </div>
            <div className="p-4 bg-in-progress/50 rounded-lg">
              <div className="text-2xl font-bold text-in-progress-accent">
                {getTasksByStatus(TaskStatus.InProgress).length}
              </div>
              <div className="text-sm text-muted-foreground">En Cours</div>
            </div>
            <div className="p-4 bg-done/50 rounded-lg">
              <div className="text-2xl font-bold text-done-accent">
                {getTasksByStatus(TaskStatus.Done).length}
              </div>
              <div className="text-sm text-muted-foreground">Terminées</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}