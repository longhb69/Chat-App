using System.ComponentModel.DataAnnotations;

namespace ChatApplication.Dtos;

public class ChatRoomDto
{
    public long Id { get; set; }
    [Required]
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsPrivate { get; set; }

    [Url]
    [StringLength(150)]
    public string ImageUrl { get; set; }
};

public class CreateChatRoomdto
{
    [Required]
    public string Name { get; set; }
    public string? Description { get; set; }
    public bool IsPrivate { get; set; }
    public string OwnerId { get; set; }

    [Url]
    [StringLength(150)]
    public string ImageUrl { get; set; }
};

