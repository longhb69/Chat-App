using System.ComponentModel.DataAnnotations;

namespace ChatApplication.Dtos;

public class AttachemntDto
{
    public long Id { get; set; }
    [Required]
    public string Name { get; set; }
    public string FileType { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    [Url]
    public string Url { get; set; }
}
