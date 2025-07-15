import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types/api';
import { apiService } from '@/services/api';
import { KanbanColumn } from './KanbanColumn';
import { CreateTaskForm } from './CreateTaskForm';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const CURRENT_USER_ID = "ee7d94bd-d413-4fa5-88af-8c956fbf83a2";

  // Fonction pour mapper les statuts numériques de l'API vers l'enum
  const mapApiStatusToEnum = (apiStatus: number): TaskStatus => {
    switch (apiStatus) {
      case 0:
        return TaskStatus.ToDo;
      case 1:
        return TaskStatus.InProgress;
      case 2:
        return TaskStatus.Done;
      default:
        return TaskStatus.ToDo;
    }
  };

  // Fonction pour mapper les tâches de l'API
  const mapApiTasksToTasks = (apiTasks: any[]): Task[] => {
    return apiTasks.map(apiTask => ({
      ...apiTask,
      status: mapApiStatusToEnum(apiTask.status),
      // Ajoutez d'autres mappings si nécessaire
    }));
  };

  const loadTasks = async (showRefreshLoader = false) => {
    try {
      setError(null);
      if (showRefreshLoader) setRefreshing(true);
      
      const data = await apiService.getTasks();
      console.log('Données reçues de l\'API:', data);
      
      // Mapper les données de l'API vers le format attendu
      const mappedTasks = mapApiTasksToTasks(data);
      setTasks(mappedTasks);
      
    } catch (error: any) {
      console.error('Erreur de chargement des tâches :', error);
      const errorMessage = error?.message ?? 'Impossible de charger les tâches';
      setError(errorMessage);
      
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      if (showRefreshLoader) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: 'Succès',
      description: 'Tâche créée avec succès',
    });
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      // Mapper l'enum vers le statut numérique pour l'API
      const apiStatus = newStatus === TaskStatus.ToDo ? 0 : 
                       newStatus === TaskStatus.InProgress ? 1 : 2;

      const updatedTask = await apiService.updateTaskStatus(taskId, {
        newStatus,
        changedByUserId: CURRENT_USER_ID,
      });

      // Mapper la réponse de l'API
      const mappedTask = {
        ...updatedTask,
        status: mapApiStatusToEnum(updatedTask.status),
      };

      setTasks(prev =>
        prev.map(task => (task.id === taskId ? mappedTask : task))
      );

      toast({
        title: 'Succès',
        description: `Tâche déplacée vers ${getStatusLabel(newStatus)}`,
      });
    } catch (error: any) {
      console.error('Erreur mise à jour statut :', error);
      toast({
        title: 'Erreur',
        description: error?.message ?? 'Impossible de changer le statut',
        variant: 'destructive',
      });
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

  const tasksByStatus = {
    [TaskStatus.ToDo]: tasks.filter(t => t.status === TaskStatus.ToDo),
    [TaskStatus.InProgress]: tasks.filter(t => t.status === TaskStatus.InProgress),
    [TaskStatus.Done]: tasks.filter(t => t.status === TaskStatus.Done),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Chargement des tâches...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Task Tracker</h1>
            <p className="text-muted-foreground">
              Suivez vos tâches facilement • {tasks.length} tâche{tasks.length > 1 ? 's' : ''} au total
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

        {/* Affichage des erreurs */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadTasks()}
                className="ml-2"
              >
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Formulaire de création */}
        <Card className="mb-8 p-6 shadow-card">
          <CreateTaskForm onTaskCreated={handleTaskCreated} currentUserId={CURRENT_USER_ID} />
        </Card>

        {/* Colonnes Kanban */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <KanbanColumn
            title="À Faire"
            status={TaskStatus.ToDo}
            tasks={tasksByStatus[TaskStatus.ToDo]}
            onStatusChange={handleStatusChange}
            className="bg-gradient-todo border-todo-border"
          />

          <KanbanColumn
            title="En Cours"
            status={TaskStatus.InProgress}
            tasks={tasksByStatus[TaskStatus.InProgress]}
            onStatusChange={handleStatusChange}
            className="bg-gradient-progress border-in-progress-border"
          />

          <KanbanColumn
            title="Terminé"
            status={TaskStatus.Done}
            tasks={tasksByStatus[TaskStatus.Done]}
            onStatusChange={handleStatusChange}
            className="bg-gradient-done border-done-border"
          />
        </div>

        {/* Statistiques */}
        <Card className="mt-8 p-6 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-todo/50 rounded-lg">
              <div className="text-2xl font-bold text-todo-accent">
                {tasksByStatus[TaskStatus.ToDo].length}
              </div>
              <div className="text-sm text-muted-foreground">À Faire</div>
            </div>
            <div className="p-4 bg-in-progress/50 rounded-lg">
              <div className="text-2xl font-bold text-in-progress-accent">
                {tasksByStatus[TaskStatus.InProgress].length}
              </div>
              <div className="text-sm text-muted-foreground">En Cours</div>
            </div>
            <div className="p-4 bg-done/50 rounded-lg">
              <div className="text-2xl font-bold text-done-accent">
                {tasksByStatus[TaskStatus.Done].length}
              </div>
              <div className="text-sm text-muted-foreground">Terminées</div>
            </div>
          </div>
        </Card>

        {/* Indicateur de dernière mise à jour */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
        </div>
      </div>
    </div>
  );
}