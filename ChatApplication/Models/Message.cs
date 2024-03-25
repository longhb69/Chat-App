namespace ChatApplication.Models;

public class Message
{
    public long Id { set; get; }
    public string SenderId { get; set; }
    public string? ReceiverId { get; set; }
    public string Content { get; set; }
    public DateTime Timestamp { get; set; }
    public ICollection<MessageReadStatus> ReadStatus { get; set; }
    public ICollection<Emoji> Emojis { get; set; }
    public ICollection<Attachment> Attachments { get; set; }
    public ChatRoom ChatRoom { get; set; }
    public long ChatRoomId { get; set; }
}
public class MessageReadStatus
{
    public int Id { set; get; }
    public string ChatMessageId { get; set; }
    public string UserId { get; set; }
    public bool isRead { get; set; }
}