using System.ComponentModel.DataAnnotations;

namespace ChatApplication.Models;

public class ChatRoom
{
    public long Id { get; set; }
    [Required]
    public string Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsPrivate { get; set; }

    [Url]
    [StringLength(150)]
    public string? ImageUrl { get; set; }
    public string? OwnerId { get; set; }
    public User? Owner { get; set; }

    public List<Message> Messages { get; set; }
    public List<User> Members { get; set; }
    public ICollection<UserChatRoom> UserChatRoom { get; set; }
}
