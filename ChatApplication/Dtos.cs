using ChatApplication.Models;
using System.ComponentModel.DataAnnotations;

namespace ChatApplication;

public record UpdateChatRoomDto(
    long Id,
    string Name,
    string Description,
    bool IsPrivate
);
public record CreateChatRoomDto(
    [Required] 
    string Name,
    string Description,
    bool IsPrivate
);