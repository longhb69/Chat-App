
using ChatApplication.Data;
using ChatApplication.Models;
using ChatApplication.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.VisualBasic;
using System.Drawing;
using System.Net;
using System.Net.WebSockets;

namespace ChatApplication.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FileUploadController : Controller
{
    private readonly ILogger<FileUploadController> _logger;
    private readonly IConfiguration _config;
    private readonly IStorage _storage;
    private readonly IMessageRepository _messageRepository;
    private readonly IThumbnailGenerator _thumbnailGenerator;

    public FileUploadController(ILogger<FileUploadController> logger, IStorage storage, IConfiguration config, IMessageRepository messageRepository
                                ,IThumbnailGenerator thumbnailGenerator)
    {
        _logger = logger;
        _storage = storage;
        _config = config;
        _messageRepository = messageRepository;
        _thumbnailGenerator = thumbnailGenerator;
    }

    [HttpPost]
    [Route("attachment/upload")]
    public async Task<IActionResult> UploadFile(IFormFile file, long messageId)
    {
        await using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);

        int width = 0;
        int height = 0;
        using (var image = Image.FromStream(memoryStream))
        {
           width = image.Width;
           height = image.Height;
        }

        string bucketName = _config["AwsConfiguration:BucketName"];
        var fileExtension = Path.GetExtension(file.FileName);
        var objName = $"{Guid.NewGuid()}.{fileExtension}";

        var s3Obj = new S3Object()
        {
            BucketName = bucketName,
            InputStream = memoryStream,
            Name = objName
        };

        var result = await _storage.UploadFileAsync(s3Obj);
        if(result.StatusCode == StatusCodes.Status200OK)
        {
            string objectUrl = $"https://{_config["AwsConfiguration:BucketName"]}.s3.ap-southeast-1.amazonaws.com/{objName}";
            var attachResult = await _messageRepository.AddAttachmentAysnc(messageId, fileExtension, objectUrl, objName, width, height);
            if(attachResult.StatusCode == StatusCodes.Status200OK)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(attachResult.Message);
            }
        }
        return Ok(result);
    }

    [HttpGet]
    [Route("attachment/dowload")]
    public async Task<IActionResult> DownloadFile(string fileName, int? width, int? height)
    {
        try
        {
            Stream fileStream = await _storage.DowloadFileAsync(_config["AwsConfiguration:BucketName"], fileName);
            string contentType;
            switch(Path.GetExtension(fileName).ToLower())
            {
                case ".jpg":
                case ".jpeg":
                    contentType = "image/jpeg";
                    break;
                case ".png":
                    contentType = "image/png";
                    break;
                case ".gif":
                    contentType = "image/gif";
                    break;
                default:
                    contentType = "application/octet-stream"; 
                    break;
            }
            if(width.HasValue && height.HasValue)
            {
                int thumnailWidth = width.Value;
                int thumnailHeight = height.Value;
                var resize = await _thumbnailGenerator.GenerateThumbnail(fileStream, thumnailWidth, thumnailHeight, Path.GetExtension(fileName));
                return File(resize, contentType);
            }
            else if(width.HasValue)
            {
                int thumnailWidth = width.Value;
                var resize = await _thumbnailGenerator.GenerateThumbnail(fileStream, thumnailWidth, 0, Path.GetExtension(fileName));
                return File(resize, contentType);
            }
            else
            {
                return File(fileStream, contentType);
            }
        }
        catch (FileNotFoundException)
        {
            return NotFound(); 
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }
}
