using ChatApplication.Models;

namespace ChatApplication.Dtos;

public class MessageDto
{
    public long Id { get; set; }
    public string SenderId { get; set; }
    public string? ReceiverId { get; set; }
    public UserDto User { get; set; }
    public string Content { get; set; }
    public DateTime Timestamp { get; set; }
    public ICollection<Emoji> Emojis { get; set; }
    public ICollection<AttachemntDto> Attachments { get; set; }
}
