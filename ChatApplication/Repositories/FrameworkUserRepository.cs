using ChatApplication.Data;
using ChatApplication.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using ChatApplication.Dtos;
using ChatApplication.Respone;
using Microsoft.AspNetCore.Http;

namespace ChatApplication.Repositories;

public class FrameworkUserRepository : IUserRepository
{
    private readonly ChatApplicationContext dbContext;
    private readonly ILogger<FrameworkUserRepository> _logger;
    private readonly UserManager<User> _userManager;

    public FrameworkUserRepository(UserManager<User> userManager, ChatApplicationContext dbContext, ILogger<FrameworkUserRepository> logger)
    {
        this.dbContext = dbContext;
        this._logger = logger;
        this._userManager = userManager;
    }
    public async Task<UserRespone> GetById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return new UserRespone { StatusCode = StatusCodes.Status404NotFound, ErrorMessage = $"User with Id ${id} not found." };
        }
        var userDto = new UserDto
        {
            Id = user.Id,
            UserName = user.UserName,
            AvatarUrl = user.AvatarUrl, 
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
        };
        return new UserRespone
        {
            UserDto = userDto,
            StatusCode = StatusCodes.Status200OK
        };
    }
    public async Task<ICollection<UserDto>> GetByUserNameAsync(string userName)
    {
        var users = await dbContext.Users
            .Where(u => u.UserName.Contains(userName))
            .Select(u => u.AsDto())
            .ToListAsync();
        return users;
    }
}
