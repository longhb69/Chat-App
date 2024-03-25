using ChatApplication.Models;
using ChatApplication.Respone;

namespace ChatApplication.Repositories;

public interface IUserChatRoomRepository
{
    public event EventHandler<UserConnection2> UserAddedToRoomEvent;
    public Task<UserChatRoomRespone> AddUserToRoom(string userId, long roomId, string senderId);
    public Task RemoveUserFromRoom(string userId, long roomId);
    public Task<ICollection<ChatRoom>> GetRoomsByUserId(string userId);
}
