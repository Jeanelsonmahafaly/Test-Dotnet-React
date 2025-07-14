using Microsoft.EntityFrameworkCore;
using TaskTracker.Api.Data;
using TaskTracker.Api.DTOs;
using TaskTracker.Api.Models;
using TaskStatusEnum = TaskTracker.Api.Models.TaskStatus;

namespace TaskTracker.Api.Services;

public interface ITaskService
{
    Task<List<TaskResponse>> GetAllTasksAsync();
    Task<TaskWithHistoryResponse?> GetTaskWithHistoryAsync(Guid id);
    Task<TaskResponse> CreateTaskAsync(CreateTaskRequest request);
    Task<TaskResponse?> UpdateTaskStatusAsync(Guid id, UpdateTaskStatusRequest request);
    Task<TaskResponse?> AssignTaskAsync(Guid id, AssignTaskRequest request);
}

public class TaskService : ITaskService
{
    private readonly TaskTrackerContext _context;

    public TaskService(TaskTrackerContext context)
    {
        _context = context;
    }

    public async Task<List<TaskResponse>> GetAllTasksAsync()
    {
        var tasks = await _context.Tasks
            .Include(t => t.AssignedTo)
            .OrderBy(t => t.CreatedAt)
            .ToListAsync();

        return tasks.Select(MapToTaskResponse).ToList();
    }

    public async Task<TaskWithHistoryResponse?> GetTaskWithHistoryAsync(Guid id)
    {
        var task = await _context.Tasks
            .Include(t => t.AssignedTo)
            .Include(t => t.Histories)
                .ThenInclude(h => h.ChangedBy)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
            return null;

        var taskResponse = MapToTaskResponse(task);
        var historyResponse = task.Histories
            .OrderByDescending(h => h.ChangeDate)
            .Select(MapToTaskHistoryResponse)
            .ToList();

        return new TaskWithHistoryResponse(taskResponse, historyResponse);
    }

    public async Task<TaskResponse> CreateTaskAsync(CreateTaskRequest request)
    {
        if (request.AssignedToUserId.HasValue)
        {
            var assignedUser = await _context.Users.FindAsync(request.AssignedToUserId.Value);
            if (assignedUser == null)
                throw new ArgumentException("Assigned user not found");
        }

        var creator = await _context.Users.FindAsync(request.CreatedByUserId);
        if (creator == null)
            throw new ArgumentException("Creator user not found");

        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Status = TaskStatusEnum.ToDo,
            AssignedToUserId = request.AssignedToUserId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        var history = new TaskHistory
        {
            TaskId = task.Id,
            ChangedByUserId = request.CreatedByUserId,
            ChangeType = ChangeType.Creation,
            NewValue = TaskStatusEnum.ToDo.ToString(),
            ChangeDate = DateTime.UtcNow
        };

        _context.TaskHistories.Add(history);
        await _context.SaveChangesAsync();

        await _context.Entry(task)
            .Reference(t => t.AssignedTo)
            .LoadAsync();

        return MapToTaskResponse(task);
    }

    public async Task<TaskResponse?> UpdateTaskStatusAsync(Guid id, UpdateTaskStatusRequest request)
    {
        var task = await _context.Tasks
            .Include(t => t.AssignedTo)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
            return null;

        if (!IsValidStatusTransition(task.Status, request.NewStatus))
            throw new InvalidOperationException($"Invalid status transition from {task.Status} to {request.NewStatus}");

        var user = await _context.Users.FindAsync(request.ChangedByUserId);
        if (user == null)
            throw new ArgumentException("User not found");

        var oldStatus = task.Status;
        task.Status = request.NewStatus;
        task.UpdatedAt = DateTime.UtcNow;

        var history = new TaskHistory
        {
            TaskId = task.Id,
            ChangedByUserId = request.ChangedByUserId,
            ChangeType = ChangeType.StatusChange,
            OldValue = oldStatus.ToString(),
            NewValue = request.NewStatus.ToString(),
            ChangeDate = DateTime.UtcNow
        };

        _context.TaskHistories.Add(history);
        await _context.SaveChangesAsync();

        return MapToTaskResponse(task);
    }

    public async Task<TaskResponse?> AssignTaskAsync(Guid id, AssignTaskRequest request)
    {
        var task = await _context.Tasks
            .Include(t => t.AssignedTo)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
            return null;

        if (request.AssignedToUserId.HasValue)
        {
            var assignedUser = await _context.Users.FindAsync(request.AssignedToUserId.Value);
            if (assignedUser == null)
                throw new ArgumentException("Assigned user not found");
        }

        var changer = await _context.Users.FindAsync(request.ChangedByUserId);
        if (changer == null)
            throw new ArgumentException("Changer user not found");

        var oldAssigneeId = task.AssignedToUserId;
        task.AssignedToUserId = request.AssignedToUserId;
        task.UpdatedAt = DateTime.UtcNow;

        var history = new TaskHistory
        {
            TaskId = task.Id,
            ChangedByUserId = request.ChangedByUserId,
            ChangeType = ChangeType.AssignmentChange,
            OldValue = oldAssigneeId?.ToString(),
            NewValue = request.AssignedToUserId?.ToString(),
            ChangeDate = DateTime.UtcNow
        };

        _context.TaskHistories.Add(history);
        await _context.SaveChangesAsync();

        await _context.Entry(task)
            .Reference(t => t.AssignedTo)
            .LoadAsync();

        return MapToTaskResponse(task);
    }

    private static bool IsValidStatusTransition(TaskStatusEnum currentStatus, TaskStatusEnum newStatus)
    {
        return currentStatus switch
        {
            TaskStatusEnum.ToDo => newStatus == TaskStatusEnum.InProgress,
            TaskStatusEnum.InProgress => newStatus == TaskStatusEnum.Done || newStatus == TaskStatusEnum.ToDo,
            TaskStatusEnum.Done => newStatus == TaskStatusEnum.InProgress,
            _ => false
        };
    }

    private static TaskResponse MapToTaskResponse(TaskItem task)
    {
        return new TaskResponse(
            task.Id,
            task.Title,
            task.Description,
            task.Status,
            task.AssignedToUserId,
            task.AssignedTo != null ? new UserResponse(task.AssignedTo.Id, task.AssignedTo.UserName) : null,
            task.CreatedAt,
            task.UpdatedAt
        );
    }

    private static TaskHistoryResponse MapToTaskHistoryResponse(TaskHistory history)
    {
        return new TaskHistoryResponse(
            history.Id,
            history.TaskId,
            history.ChangedByUserId,
            new UserResponse(history.ChangedBy.Id, history.ChangedBy.UserName),
            history.ChangeType,
            history.OldValue,
            history.NewValue,
            history.ChangeDate
        );
    }
}