using Microsoft.EntityFrameworkCore;
using TaskTracker.Api.Data;
using TaskTracker.Api.DTOs;
using TaskTracker.Api.Models;

namespace TaskTracker.Api.Services;

public interface IUserService
{
    Task<List<UserResponse>> GetAllUsersAsync();

    Task<UserResponse> CreateUserAsync(string userName);
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

    public async Task<UserResponse> CreateUserAsync(string userName)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = userName
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserResponse(user.Id, user.UserName);
    }

}