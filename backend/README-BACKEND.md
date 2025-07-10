
## Installation et démarrage

### 1. Restaurer les packages
```bash
cd backend
dotnet restore
```

### 2. Configuration de la base de données

#### SQL Server (par défaut)
La configuration utilise SQL Server LocalDB par défaut. Aucune configuration supplémentaire nécessaire.

#### PostgreSQL (pour la base)
1.  la config est en postgres mais , il faut changer en SqlServer

2. Dans `Program.cs`, commentez SQL Server et décommentez PostgreSQL:
```csharp
// SQL Server (default)
// builder.Services.AddDbContext<TaskTrackerContext>(options =>
//     options.UseSqlServer(connectionString));

// PostgreSQL
builder.Services.AddDbContext<TaskTrackerContext>(options =>
    options.UseNpgsql(connectionString));
```

3. Modifiez la connection string dans `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=TaskTrackerDb_Dev;Username=postgres;Password=yourpassword"
  }
}
```

### 3. Créer la base de données
```
dotnet ef database update run --project TaskTracker.Api
dotnet ef database update
```


### 4. Démarrer l'API
```bash
dotnet run --project TaskTracker.Api
```


## API Endpoints

### Users
- `GET /api/users` - Liste tous les utilisateurs

### Tasks
- `GET /api/tasks` - Liste toutes les tâches avec utilisateurs assignés
- `GET /api/tasks/{id}` - Récupère une tâche avec son historique
- `POST /api/tasks` - Crée une nouvelle tâche
- `PUT /api/tasks/{id}/status` - Met à jour le statut d'une tâche
- `PUT /api/tasks/{id}/assign` - Assigne/désassigne une tâche


## Configuration CORS

L'API est configurée pour accepter les requêtes depuis:
- http://localhost:8080 (React Vite)
- http://localhost:3000 (React CRA)

## Tests

### Tests unitaires (à implémenter)
```bash
dotnet test
```

### Test avec Swagger
Utilisez l'interface Swagger disponible à https://localhost:7001 pour tester les endpoints.



