using ChatApplication.Dtos;

namespace ChatApplication.Repositories;

public interface IFriendShipRepository
{
    Task<ICollection<UserDto>> GetFriendRequest(string targetUserId);
    Task<ICollection<UserDto>> GetFriends(string targetUserId);
    Task FriendRequest(string requesterId, string targetUserId);
    Task AcceptedRequest(string requesterId, string targetUserId);
    Task<String> CheckFriendShip(string requesterId, string targetUserId);

}
