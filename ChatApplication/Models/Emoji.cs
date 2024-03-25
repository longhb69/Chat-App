namespace ChatApplication.Models;

public class Emoji
{
    public int Id { set; get; }
    public string ChatMessageId { get; set; }
    public string UserId { get; set; }
    public string EmojiSymbol { get; set; }
}
