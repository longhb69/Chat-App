using ChatApplication.Dtos;

namespace ChatApplication.Respone;

public class AttachmentRespone
{
    public int StatusCode { get; set; }
    public string? Message { get; set; }
    public AttachemntDto? Attachemnt { get; set; }
}
