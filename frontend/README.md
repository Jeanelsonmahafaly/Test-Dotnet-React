# Task 

## Description
Application de suivi de tâches simple inspirée de Trello/Jira, développée dans le cadre d'un test technique. L'application permet de créer des tâches et de les faire progresser à travers différents statuts (ToDo, InProgress, Done).

## Architecture
- **Frontend**: React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: .NET 9 Core API REST
- **Base de données**: PostgreSQL


## Fonctionnalités

### Backend (.NET Core API)
- ✅ **Modèles**: User, Task, TaskHistory
- ✅ **API REST** avec endpoints:
  - `GET /api/users` - Liste des utilisateurs
  - `GET /api/tasks` - Liste des tâches
  - `GET /api/tasks/{id}` - Tâche avec historique
  - `POST /api/tasks` - Création de tâche
  - `PUT /api/tasks/{id}/status` - Mise à jour du statut
  - `PUT /api/tasks/{id}/assign` - Assignation de tâche
- ✅ **Validation** des transitions de statut
- ✅ **Historique** des changements
- ✅ **Support** SQL Server et PostgreSQL

### Frontend (React)
- ✅ **Tableau Kanban** avec 3 colonnes (ToDo, InProgress, Done)
- ✅ **Création de tâches** avec formulaire
- ✅ **Changement de statut** avec boutons d'action
- ✅ **Interface responsive** et moderne
- ✅ **Notifications** de succès/erreur
- ✅ **Statistiques** des tâches par statut

## Installation et démarrage

### Prérequis
- Node.js (v18 ou supérieur)
- .NET 9 SDK
- SQL Server ou PostgreSQL

### Frontend (React)
```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# L'application sera accessible sur http://localhost:8080
```

### Backend (.NET Core) - À implémenter
```bash
# Naviguez vers le dossier backend (à créer)
cd backend

# Restaurez les packages NuGet
dotnet restore

# Créez la base de données
dotnet ef database update

# Démarrez l'API
dotnet run

# L'API sera accessible sur https://localhost:7001
```

## Configuration de la base de données

### SQL Server (par défaut)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TaskTrackerDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### PostgreSQL (alternative)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=TaskTrackerDb;Username=postgres;Password=yourpassword"
  }
}
```

## API Endpoints

### Users
- `GET /api/users` - Récupère tous les utilisateurs

### Tasks
- `GET /api/tasks` - Récupère toutes les tâches
- `GET /api/tasks/{id}` - Récupère une tâche avec son historique
- `POST /api/tasks` - Crée une nouvelle tâche
- `PUT /api/tasks/{id}/status` - Met à jour le statut d'une tâche
- `PUT /api/tasks/{id}/assign` - Assigne/désassigne une tâche

## Règles métier

### Transitions de statut valides
- **ToDo** → InProgress
- **InProgress** → Done ou ToDo
- **Done** → InProgress

### Historique
Chaque modification (création, changement de statut, assignation) est enregistrée dans l'historique avec:
- Utilisateur qui a effectué le changement
- Type de changement
- Ancienne et nouvelle valeur
- Date du changement

## Technologies utilisées

### Frontend
- React 18 avec TypeScript
- Tailwind CSS pour le styling
- shadcn/ui pour les composants
- React Query pour la gestion des requêtes API
- Lucide React pour les icônes

### Backend (à implémenter)
- .NET 9 Core Web API
- Entity Framework Core
- SQL Server / PostgreSQL
- AutoMapper (optionnel)
- Swagger pour la documentation API

## Développement



## Tests

### Frontend
```bash
# Tests unitaires (à implémenter)
npm test

# Tests E2E (à implémenter)
npm run test:e2e
```

### Backend
```bash
# Tests unitaires (à implémenter)
dotnet test
```

## Déploiement

### Frontend
```bash
# Build de production
npm run build

# Les fichiers sont générés dans le dossier dist/
```

### Backend
```bash
# Publication
dotnet publish -c Release

# Déploiement selon votre environnement
```

## Démonstration

Le frontend est actuellement configuré pour se connecter à l'API backend sur `https://localhost:7001`. 


## Prochaines étapes

1. **Implémenter le backend .NET Core** avec:
   - Modèles de données
   - Contrôleurs API
   - Services métier
   - Configuration Entity Framework
   - Validation et gestion d'erreurs

2. **Ajouter les tests** unitaires et d'intégration

3. **Améliorer l'UX** avec:
   - Drag & drop des tâches
   - Filtres et recherche
   - Assignation d'utilisateurs
   - Notifications en temps réel

4. **Optimisations** performance et sécurité
# Test-Dotnet-React
