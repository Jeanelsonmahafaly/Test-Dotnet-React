import { useEffect, useState } from 'react';
import { Task, User } from '@/types/api';
import { apiService } from '@/services/api';

interface TaskAssignProps {
    task: Task;
    currentUserId: string; // l'utilisateur qui fait la modification
    onAssigned: (updatedTask: Task) => void;
}

export function TaskAssign({ task, currentUserId, onAssigned }: TaskAssignProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState(task.assignedToUserId || '');

    const [changerUserId, setChangerUserId] = useState<string>(''); // <== 👈

    useEffect(() => {
        apiService.getUsers()
            .then((fetchedUsers) => {
                setUsers(fetchedUsers);
                if (fetchedUsers.length > 0) {
                    setChangerUserId(fetchedUsers[0].id); // 👈 Premier utilisateur
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        apiService.getUsers().then(setUsers).catch(console.error);
    }, []);

    const handleAssign = async () => {
        try {
            const updated = await apiService.assignTask(task.id, {
                assignedToUserId: selectedUserId || null,
                changedByUserId: changerUserId
            });
            onAssigned(updated);
        } catch (error) {
            console.error('Erreur assignation', error);
        }
    };

    return (
        <div className="space-y-2">
            <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="border rounded px-2 py-1 w-full"
            >
                <option value="">-- Aucun assigné --</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>{user.userName}</option>
                ))}
            </select>

            <button
                onClick={handleAssign}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
                Assigner
            </button>
        </div>
    );
}
