using ChatApplication.Data;
using ChatApplication.Models;
using ChatApplication.Respone;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NuGet.Packaging.Signing;
using System.Security.Claims;

namespace ChatApplication.Repositories;

public class FrameworkUserChatRoomRepository : IUserChatRoomRepository
{
    private readonly ChatApplicationContext dbContext;
    private readonly UserManager<User> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<FrameworkUserChatRoomRepository> _logger;

    public event EventHandler<UserConnection2> UserAddedToRoomEvent;

    public FrameworkUserChatRoomRepository(ChatApplicationContext dbContext, IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, 
                                            ILogger<FrameworkUserChatRoomRepository> logger)
    {
        this.dbContext = dbContext;
        this._httpContextAccessor = httpContextAccessor;
        this._userManager = userManager;
        this._logger = logger;
    }

    public async Task<UserChatRoomRespone> AddUserToRoom(string userId, long roomId, string senderId)
    {
        bool alreadyInRoom = dbContext.userChatRooms
                            .Any(ucr => ucr.UserId == userId && ucr.ChatRoomId == roomId);

        var user = await _userManager.FindByIdAsync(senderId);
        var chatroom = dbContext.ChatRooms.Find(roomId);

        if ((chatroom.OwnerId != user.Id) && user is not null)
        {
            return new UserChatRoomRespone
            {
                StatusCode = StatusCodes.Status401Unauthorized,
                ErrorMessage = "User is not admin"
            };
        }

        if (!alreadyInRoom)
        {
            var userChatRoom = new UserChatRoom
            {
                UserId = userId,
                ChatRoomId = roomId
            };
            dbContext.userChatRooms.Add(userChatRoom);
            await dbContext.SaveChangesAsync();
            return new UserChatRoomRespone { StatusCode = StatusCodes.Status201Created };
        }
        UserAddedToRoomEvent?.Invoke(this, new UserConnection2(userId, roomId));
        return new UserChatRoomRespone { StatusCode = StatusCodes.Status200OK };
    }

    public  async Task<ICollection<ChatRoom>> GetRoomsByUserId(string userId)
    {
        var chatRoomsId = dbContext.userChatRooms
             .Where(ucr => ucr.UserId == userId)
             .Select(ucr => ucr.ChatRoomId)
             .ToList();
        return await dbContext.ChatRooms.Where(c => chatRoomsId.Contains(c.Id)).ToListAsync();
    }

    public async Task RemoveUserFromRoom(string userId, long roomId)
    {
        var userToRemove = await dbContext.userChatRooms
            .FirstOrDefaultAsync(ucr => ucr.UserId == userId && ucr.ChatRoomId == roomId);
        if(userToRemove != null)
        {
            dbContext.userChatRooms.Remove(userToRemove);
            await dbContext.SaveChangesAsync();
        }
    }
}
