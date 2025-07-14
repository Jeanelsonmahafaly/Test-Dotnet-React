import { useState } from 'react';
import { CreateTaskRequest, Task } from '@/types/api';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';

interface CreateTaskFormProps {
  onTaskCreated: (task: Task) => void;
  currentUserId: number;
}

export function CreateTaskForm({ onTaskCreated, currentUserId }: CreateTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est obligatoire",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const request: CreateTaskRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        createdByUserId: currentUserId,
      };

      const newTask = await apiService.createTask(request);
      onTaskCreated(newTask);
      
      // Reset form
      setTitle('');
      setDescription('');
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la tâche",
        variant: "destructive",
      });
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Créer une nouvelle tâche</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entrez le titre de la tâche..."
              disabled={loading}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnelle)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Entrez une description..."
              disabled={loading}
              rows={3}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading || !title.trim()}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Créer la tâche
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}