using System.ComponentModel.DataAnnotations;

namespace ChatApplication.Models;

public class Emoji
{
    public long Id { set; get; }
    public string EmojiSymbol { get; set; }

    [Url]
    public string imageUrl { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    public long MessageId { get; set; }
    public Message Message { get; set; } = null!;
}
