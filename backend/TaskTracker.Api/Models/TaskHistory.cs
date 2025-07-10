using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskTracker.Api.Models;

public class TaskHistory
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid TaskId { get; set; }
    
    [ForeignKey(nameof(TaskId))]
    public virtual TaskItem Task { get; set; } = null!;
    
    [Required]
    public Guid ChangedByUserId { get; set; }
    
    [ForeignKey(nameof(ChangedByUserId))]
    public virtual User ChangedBy { get; set; } = null!;
    
    [Required]
    public ChangeType ChangeType { get; set; }
    
    [StringLength(500)]
    public string? OldValue { get; set; }
    
    [StringLength(500)]
    public string? NewValue { get; set; }
    
    public DateTime ChangeDate { get; set; } = DateTime.UtcNow;
}

public enum ChangeType
{
    Creation = 0,
    StatusChange = 1,
    AssignmentChange = 2
}