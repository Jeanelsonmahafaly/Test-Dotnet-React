import { useState } from 'react';
import { Task } from '@/types/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStatusColor } from '@/types/api';
import { TaskAssign } from './TaskAssign';

interface TaskCardProps {
  task: Task;
  primaryAction?: {
    text: string;
    variant: 'default' | 'secondary' | 'outline';
    onClick: () => void | Promise<void>;
  };
  secondaryActions?: {
    text: string;
    variant: 'default' | 'secondary' | 'outline';
    onClick: () => void | Promise<void>;
  }[];
}

export function TaskCard({
  task,
  primaryAction,
  secondaryActions
}: TaskCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [localTask, setLocalTask] = useState<Task>(task);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const handleAssign = (updatedTask: Task) => {
    setLocalTask(updatedTask);
    setShowModal(false);
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-200 hover:scale-[1.02] bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* En-tête */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-foreground leading-tight flex-1">
              {localTask.title}
            </h3>
            <Badge className={cn("text-xs px-2 py-1", getStatusColor(localTask.status))}>
              #{localTask.id}
            </Badge>
          </div>

          {/* Description */}
          {localTask.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {localTask.description}
            </p>
          )}

          {/* Métadonnées */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              <span>{formatDate(localTask.createdAt)}</span>
            </div>

            {localTask.assignedTo ? (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{localTask.assignedTo.userName}</span>
              </div>
            ) : (
              <div className="text-xs italic text-gray-500">Non assigné</div>
            )}
          </div>

          {/* Actions principales */}
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              variant={primaryAction.variant}
              size="sm"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              {primaryAction.text}
            </Button>
          )}

          {/* Actions secondaires */}
          {secondaryActions && secondaryActions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {secondaryActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant}
                  size="sm"
                >
                  {action.text}
                </Button>
              ))}
            </div>
          )}

          {/* Bouton pour modifier l’assigné */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowModal(true)}
            >
              Modifier l’assigné
            </Button>
          </div>

          {/* Modal d’assignation */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded shadow-md w-[90%] max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
                <h3 className="text-lg font-semibold mb-4">Assigner la tâche</h3>
                <TaskAssign
                  task={localTask}
                  currentUserId="admin-id-temp" // ⛔️ À remplacer dynamiquement par l'utilisateur actuel
                  onAssigned={handleAssign}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
