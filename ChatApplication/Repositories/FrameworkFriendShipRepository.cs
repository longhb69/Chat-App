
using ChatApplication.Data;
using ChatApplication.Dtos;
using ChatApplication.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore; 

//using System.Data.Entity;

using System.Linq;
namespace ChatApplication.Repositories;

public class FrameworkFriendShipRepository : IFriendShipRepository
{
    private readonly ChatApplicationContext _dbContext;
    private readonly UserManager<User> _userManager;

    public FrameworkFriendShipRepository(ChatApplicationContext dbContext, UserManager<User> userManager)
    {
        this._dbContext = dbContext;
        this._userManager = userManager;
    }

    public async Task FriendRequest(string requesterId, string targetUserId)
    {
        try
        {
            bool friendExists = _dbContext.Friendships.Any(f => (f.user_id_1 == requesterId && f.user_id_2 == targetUserId) 
                                                                || (f.user_id_2 == requesterId && f.user_id_1 == targetUserId));
            if (!friendExists) 
            {
                var friendship = new Friendships
                {
                    user_id_1 = requesterId,
                    user_id_2 = targetUserId,
                    status = "pending"
                };
                _dbContext.Friendships.Add(friendship);
                await _dbContext.SaveChangesAsync();
                Console.WriteLine("Add sucess");
            }
        } catch (Exception ex) 
        {
            Console.WriteLine($"An error occurred while processing the friend request: {ex.Message}");
            throw;
        }
    }
    public async Task AcceptedRequest(string requesterId, string targetUserId)
    {
        var friendship = await _dbContext.Friendships.Where(f => (f.user_id_1 == requesterId && f.user_id_2 == targetUserId) || (f.user_id_2 == requesterId && f.user_id_1 == targetUserId))
                                            .FirstOrDefaultAsync();  //have to use Microsoft.EntityFrameworkCore
        if (friendship != null)
        {
            friendship.status = "accepted";
            await _dbContext.SaveChangesAsync();
        }
        else
        {
            throw new InvalidOperationException("Friendship record not found.");
        }
    }

    public async Task<ICollection<UserDto>> GetFriendRequest(string targetUserId)
    {
        var friendship = await _dbContext.Friendships
                                             .Where(f => f.user_id_2 == targetUserId && f.status == "pending")
                                             .Select(f => f.user_id_1)
                                             .ToListAsync(); 
        if(friendship != null)
        {
            var users = await _dbContext.Users
                        .Where(u => friendship.Contains(u.Id))
                        .Select(u => u.AsDto())
                        .ToListAsync();
            return users;
        }
        return null;
    }

    public async Task<string> CheckFriendShip(string requesterId, string targetUserId)
    {
        var friendship = _dbContext.Friendships
                                .Where(f => (f.user_id_1 == requesterId && f.user_id_2 == targetUserId)
                                            || (f.user_id_2 == requesterId && f.user_id_1 == targetUserId))
                                .Select(f => f.status)
                                .FirstOrDefault();
        return friendship;
    }

    public async Task<ICollection<UserDto>> GetFriends(string targetUserId)
    {
        var friendship = await _dbContext.Friendships
                                             .Where(f => (f.user_id_2 == targetUserId || f.user_id_1 == targetUserId) && f.status == "accepted")
                                             .Select(f => f.user_id_1 != targetUserId ? f.user_id_1 : f.user_id_2)
                                             .ToListAsync();
        if (friendship != null)
        {
            var users = await _dbContext.Users
                        .Where(u => friendship.Contains(u.Id))
                        .Select(u => u.AsDto())
                        .ToListAsync();
            return users;
        }
        return null;
    }
}
