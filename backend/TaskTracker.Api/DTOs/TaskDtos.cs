using TaskTracker.Api.Models;
using TaskStatusEnum = TaskTracker.Api.Models.TaskStatus;
namespace TaskTracker.Api.DTOs;

public class CreateTaskRequest
{
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public Guid? AssignedToUserId { get; init; }  // Bien Guid? nullable
    public Guid CreatedByUserId { get; init; }
}


public record UpdateTaskStatusRequest(
    TaskStatusEnum NewStatus,
    Guid ChangedByUserId
);

public record AssignTaskRequest(
    Guid? AssignedToUserId,
    Guid ChangedByUserId
);

public record TaskResponse(
    Guid Id,
    string Title,
    string? Description,
    TaskStatusEnum Status, 
    Guid? AssignedToUserId,
    UserResponse? AssignedTo,
    DateTime CreatedAt,
    DateTime UpdatedAt
);


public record UserResponse
{
    public Guid Id { get; }
    public string UserName { get; }

    public UserResponse(Guid id, string userName)
    {
        Id = id;
        UserName = userName;
    }
}


public record TaskHistoryResponse(
    Guid Id,
    Guid TaskId,
    Guid ChangedByUserId,
    UserResponse ChangedBy,
    ChangeType ChangeType,
    string? OldValue,
    string? NewValue,
    DateTime ChangeDate
);

public record TaskWithHistoryResponse(
    TaskResponse Task,
    List<TaskHistoryResponse> History
);