
using ChatApplication.Data;
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
            var friendship = new Friendships
            {
                user_id_1 = requesterId,
                user_id_2 = targetUserId,
                status = "pending"
            };
            _dbContext.Friendships.Add(friendship);
            await _dbContext.SaveChangesAsync();
            Console.WriteLine("Add sucess");
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
        Console.WriteLine(friendship);
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
}
