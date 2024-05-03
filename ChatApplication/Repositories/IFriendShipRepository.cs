namespace ChatApplication.Repositories;

public interface IFriendShipRepository
{
    Task FriendRequest(string requesterId, string targetUserId);
    Task AcceptedRequest(string requesterId, string targetUserId);
}
