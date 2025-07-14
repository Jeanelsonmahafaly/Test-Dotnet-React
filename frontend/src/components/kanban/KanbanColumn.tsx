import { Task, TaskStatus, VALID_TRANSITIONS } from '@/types/api';
import { TaskCard } from './TaskCard';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (taskId: number, newStatus: TaskStatus) => Promise<void>;
  className?: string;
}

export function KanbanColumn({ 
  title, 
  status, 
  tasks, 
  onStatusChange, 
  className 
}: KanbanColumnProps) {
  const getNextStatus = (currentStatus: TaskStatus): TaskStatus | null => {
    const validTransitions = VALID_TRANSITIONS[currentStatus];
    return validTransitions.length > 0 ? validTransitions[0] : null;
  };

  const getActionButtonText = (currentStatus: TaskStatus): string => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return '';
    
    switch (nextStatus) {
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

  return (
    <Card className={cn(
      "min-h-[600px] border-2 transition-all duration-300 hover:shadow-elevated",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <Badge variant="secondary" className="bg-white/80">
            {tasks.length}
          </Badge>
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
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                actionButtonText={getActionButtonText(task.status)}
                onAction={() => {
                  const nextStatus = getNextStatus(task.status);
                  if (nextStatus) {
                    onStatusChange(task.id, nextStatus);
                  }
                }}
                showActionButton={getNextStatus(task.status) !== null}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}