import { Task } from '@/types/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  actionButtonText: string;
  onAction: () => void;
  showActionButton: boolean;
}

export function TaskCard({ 
  task, 
  actionButtonText, 
  onAction, 
  showActionButton 
}: TaskCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ToDo':
        return 'bg-todo-accent text-white';
      case 'InProgress':
        return 'bg-in-progress-accent text-white';
      case 'Done':
        return 'bg-done-accent text-white';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-200 hover:scale-[1.02] bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-foreground leading-tight flex-1">
              {task.title}
            </h3>
            <Badge className={cn("text-xs px-2 py-1", getStatusColor(task.status))}>
              #{task.id}
            </Badge>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              <span>{formatDate(task.createdAt)}</span>
            </div>
            
            {task.assignedTo && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{task.assignedTo.userName}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          {showActionButton && actionButtonText && (
            <Button
              onClick={onAction}
              size="sm"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              {actionButtonText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}