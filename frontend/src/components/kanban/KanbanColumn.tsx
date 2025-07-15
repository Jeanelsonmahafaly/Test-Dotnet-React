import { Task, TaskStatus, VALID_TRANSITIONS } from '@/types/api';
import { TaskCard } from './TaskCard';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  className?: string;
}

export function KanbanColumn({ 
  title, 
  status, 
  tasks, 
  onStatusChange, 
  className 
}: KanbanColumnProps) {
  
  const getValidTransitions = (currentStatus: TaskStatus): TaskStatus[] => {
    return VALID_TRANSITIONS[currentStatus] || [];
  };

  const getPrimaryTransition = (currentStatus: TaskStatus): TaskStatus | null => {
    switch (currentStatus) {
      case TaskStatus.ToDo:
        return TaskStatus.InProgress;
      case TaskStatus.InProgress:
        return TaskStatus.Done;
      case TaskStatus.Done:
        return TaskStatus.InProgress;
      default:
        const transitions = getValidTransitions(currentStatus);
        return transitions.length > 0 ? transitions[0] : null;
    }
  };

  const getSecondaryTransitions = (currentStatus: TaskStatus): TaskStatus[] => {
    const validTransitions = getValidTransitions(currentStatus);
    const primary = getPrimaryTransition(currentStatus);
    return validTransitions.filter(t => t !== primary);
  };

  const getActionButtonText = (targetStatus: TaskStatus): string => {
    switch (targetStatus) {
      case TaskStatus.InProgress:
        return 'Commencer';
      case TaskStatus.Done:
        return 'Terminer';
      case TaskStatus.ToDo:
        return 'Reprendre';
      default:
        return 'Suivant';
    }
  };

  const getButtonVariant = (
    targetStatus: TaskStatus
  ): 'default' | 'secondary' | 'outline' => {
    switch (targetStatus) {
      case TaskStatus.InProgress:
      case TaskStatus.Done:
        return 'default';
      case TaskStatus.ToDo:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className={cn(
      "min-h-[600px] border-2 transition-all duration-300 hover:shadow-elevated",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <Badge variant="secondary" className="bg-white/80">{tasks.length}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2 opacity-30">📋</div>
              <p className="text-sm">Aucune tâche</p>
            </div>
          ) : (
            tasks.map((task) => {
              const primaryTransition = getPrimaryTransition(task.status);
              const secondaryTransitions = getSecondaryTransitions(task.status);

              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  primaryAction={primaryTransition ? {
                    text: getActionButtonText(primaryTransition),
                    variant: getButtonVariant(primaryTransition),
                    onClick: () => onStatusChange(task.id, primaryTransition)
                  } : undefined}
                  secondaryActions={secondaryTransitions.map(transition => ({
                    text: getActionButtonText(transition),
                    variant: getButtonVariant(transition),
                    onClick: () => onStatusChange(task.id, transition)
                  }))}
                />
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
