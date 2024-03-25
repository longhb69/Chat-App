using System.ComponentModel.DataAnnotations;

namespace ChatApplication.Models;

public class Attachment
{
    public long Id { get; set; }
    [Required]
    public string Name { get; set; }
    public long MessageId { get; set; }
    public string FileType { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    [Url]
    public string Url { get; set; }
    public Message Message { get; set; } = null!;
}
