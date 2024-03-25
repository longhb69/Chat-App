using ChatApplication.Dtos;

namespace ChatApplication.Respone;

public class MessageResult
{
    public List<MessageDto> Messages { get; set; }
    public int StatusCode { get; set; }
    public string? ErrorMessage { get; set; }
}
