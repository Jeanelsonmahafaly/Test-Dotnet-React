using Microsoft.AspNetCore.Mvc;
using TaskTracker.Api.DTOs;
using TaskTracker.Api.Services;

namespace TaskTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    /// <summary>
    /// Récupère toutes les tâches
    /// </summary>
    /// <returns>Liste des tâches avec utilisateurs assignés</returns>
    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        try
        {
            var tasks = await _taskService.GetAllTasksAsync();
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Récupère une tâche avec son historique
    /// </summary>
    /// <param name="id">ID de la tâche</param>
    /// <returns>Tâche avec historique</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTask(Guid id)
    {
        try
        {
            var task = await _taskService.GetTaskWithHistoryAsync(id);
            if (task == null)
                return NotFound(new { error = "Task not found" });

            return Ok(task);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Crée une nouvelle tâche
    /// </summary>
    /// <param name="request">Données de la tâche</param>
    /// <returns>Tâche créée</returns>
    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Title))
                return BadRequest(new { error = "Title is required" });

            var task = await _taskService.CreateTaskAsync(request);
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Met à jour le statut d'une tâche
    /// </summary>
    /// <param name="id">ID de la tâche</param>
    /// <param name="request">Nouveau statut</param>
    /// <returns>Tâche mise à jour</returns>
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateTaskStatus(Guid id, [FromBody] UpdateTaskStatusRequest request)
    {
        try
        {
            var task = await _taskService.UpdateTaskStatusAsync(id, request);
            if (task == null)
                return NotFound(new { error = "Task not found" });

            return Ok(task);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }

    /// <summary>
    /// Assigne ou désassigne une tâche
    /// </summary>
    /// <param name="id">ID de la tâche</param>
    /// <param name="request">Données d'assignation</param>
    /// <returns>Tâche mise à jour</returns>
    [HttpPut("{id}/assign")]
    public async Task<IActionResult> AssignTask(Guid id, [FromBody] AssignTaskRequest request)
    {
        try
        {
            var task = await _taskService.AssignTaskAsync(id, request);
            if (task == null)
                return NotFound(new { error = "Task not found" });

            return Ok(task);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal server error", message = ex.Message });
        }
    }
}