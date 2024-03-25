namespace ChatApplication.Models;

public class UserChatRoom
{
    public User User { get; set; }
    public string UserId { get; set; } 

    public ChatRoom ChatRoom { get; set; }
    public long ChatRoomId { get; set; }
}
