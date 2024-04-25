using System.ComponentModel.DataAnnotations;

namespace ChatApplication.Dtos;

public class UserDto
{
    public string Id { get; set; }
    [Required]
    public string UserName { get; set; }
    [Url]
    public string? AvatarUrl { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
}
