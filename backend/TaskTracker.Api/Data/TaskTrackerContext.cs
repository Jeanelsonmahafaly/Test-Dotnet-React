using Microsoft.EntityFrameworkCore;
using TaskTracker.Api.Models;
using TaskStatusEnum = TaskTracker.Api.Models.TaskStatus;
namespace TaskTracker.Api.Data;

public class TaskTrackerContext : DbContext
{
    public TaskTrackerContext(DbContextOptions<TaskTrackerContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<TaskHistory> TaskHistories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure TaskItem
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();

            entity.HasOne(e => e.AssignedTo)
                  .WithMany(u => u.AssignedTasks)
                  .HasForeignKey(e => e.AssignedToUserId)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
        });

        // Configure User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserName).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.UserName).IsUnique();
        });

        // Configure TaskHistory
        modelBuilder.Entity<TaskHistory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ChangeType).IsRequired();
            entity.Property(e => e.ChangeDate).IsRequired();
            entity.Property(e => e.OldValue).HasMaxLength(500);
            entity.Property(e => e.NewValue).HasMaxLength(500);

            entity.HasOne(e => e.Task)
                  .WithMany(t => t.Histories)
                  .HasForeignKey(e => e.TaskId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.ChangedBy)
                  .WithMany(u => u.TaskHistories)
                  .HasForeignKey(e => e.ChangedByUserId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.TaskId);
            entity.HasIndex(e => e.ChangeDate);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Users
        modelBuilder.Entity<User>().HasData(
            new User { Id = Guid.NewGuid(), UserName = "John Doe" },
            new User { Id = Guid.NewGuid(),  UserName = "Jane Smith" },
            new User { Id = Guid.NewGuid(), UserName = "Bob Johnson" }
        );

        }
}