using Microsoft.EntityFrameworkCore;
using TaskTracker.Api.Data;
using TaskTracker.Api.DTOs;

namespace TaskTracker.Api.Services;

public interface IUserService
{
    Task<List<UserResponse>> GetAllUsersAsync();
}

public class UserService : IUserService
{
    private readonly TaskTrackerContext _context;

    public UserService(TaskTrackerContext context)
    {
        _context = context;
    }

    public async Task<List<UserResponse>> GetAllUsersAsync()
    {
        var users = await _context.Users
            .OrderBy(u => u.UserName)
            .ToListAsync();

        return users.Select(u => new UserResponse(u.Id, u.UserName)).ToList();
    }
}