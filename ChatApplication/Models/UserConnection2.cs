namespace ChatApplication.Models;

public class UserConnection2
{
    public string UserId { get; set; }
    public long ChatRoomId { get; set; }

    public UserConnection2(string userId, long chatRoomId)
    {
        UserId = userId;
        ChatRoomId = chatRoomId;
    }
}
