using Microsoft.EntityFrameworkCore;
using TaskTracker.Api.Data;
using TaskTracker.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Database configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<TaskTrackerContext>(options =>
   options.UseNpgsql(connectionString));

// Register services
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "Task Tracker API",
        Version = "v1",
        Description = "API REST pour la gestion de tâches (Mini-Kanban)"
    });
});

// CORS configuration - PLUS PERMISSIVE pour le développement
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:8080") 
              .AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configuration de Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Tracker API v1");
        c.RoutePrefix = "swagger";
        c.EnableTryItOutByDefault();
        c.DefaultModelsExpandDepth(-1);
        c.DocumentTitle = "Task Tracker API Documentation";
        
        c.ConfigObject.AdditionalItems["supportedSubmitMethods"] = new[] { "get", "post", "put", "delete" };
        c.ConfigObject.AdditionalItems["servers"] = new[] 
        { 
            new { url = "http://localhost:5000", description = "Development HTTP" }
        };
    });
}

// ORDRE DES MIDDLEWARES - CRITIQUE !
app.UseRouting();

// CORS doit être après UseRouting et avant UseAuthorization
app.UseCors("AllowAll");

// Commentez temporairement UseHttpsRedirection pour tester en HTTP
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Ensure database is created and seeded
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TaskTrackerContext>();
    context.Database.EnsureCreated();
}

app.Run();