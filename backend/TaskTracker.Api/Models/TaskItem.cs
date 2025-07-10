using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskTracker.Api.Models;

public class TaskItem
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    public TaskStatus Status { get; set; } = TaskStatus.ToDo;
    
    public int? AssignedToUserId { get; set; }
    
    [ForeignKey(nameof(AssignedToUserId))]
    public virtual User? AssignedTo { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<TaskHistory> Histories { get; set; } = new List<TaskHistory>();
}

public enum TaskStatus
{
    ToDo = 0,
    InProgress = 1,
    Done = 2
}