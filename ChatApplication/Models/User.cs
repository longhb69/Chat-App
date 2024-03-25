using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ChatApplication.Models;

public class User : IdentityUser
{
    public ICollection<ChatRoom>? ChatRooms { get; set; }
    public ICollection<UserChatRoom> UserChatRoom { get; set; }
}
