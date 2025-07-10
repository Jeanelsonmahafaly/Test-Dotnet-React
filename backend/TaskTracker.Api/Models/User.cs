using System.ComponentModel.DataAnnotations;

namespace TaskTracker.Api.Models;

public class User
{
    public Guid Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string UserName { get; set; } = string.Empty;
    
    // Navigation properties
    public virtual ICollection<TaskItem> AssignedTasks { get; set; } = new List<TaskItem>();
    public virtual ICollection<TaskHistory> TaskHistories { get; set; } = new List<TaskHistory>();
}