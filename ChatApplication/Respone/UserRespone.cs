using ChatApplication.Dtos;

namespace ChatApplication.Respone;

public class UserRespone
{
    public UserDto? UserDto { get; set; }
    public int StatusCode { get; set; }
    public string? ErrorMessage { get; set; }
}
