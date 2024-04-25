
using ChatApplication.Data;
using ChatApplication.Models;
using ChatApplication.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.VisualBasic;
using System.Diagnostics;
using System.Net;
using System.Net.WebSockets;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.PixelFormats;


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
    [Route("attachment/upload/{messageId}")]
    [RequestSizeLimit(100*1024*1024)]
    public async Task<IActionResult> UploadFile(IFormFile file, long messageId)
    {
        await using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);

        int width = 0;
        int height = 0;

        if(IsImage(file.FileName))
        {
            memoryStream.Position = 0;
            using (Image image = await Image.LoadAsync(memoryStream))
            {
                width = image.Width;
                height = image.Height;
            }
        }
        if(IsVideo(file.FileName))
        {
            (width, height) = await GetVideoDimensionsFromFFmpeg(memoryStream);
        };

        string bucketName = _config["AwsConfiguration:BucketName"];
        var fileExtension = Path.GetExtension(file.FileName);
        var objName = $"{file.FileName}_{Guid.NewGuid()}.{fileExtension}";

        var s3Obj = new S3Object()
        {
            BucketName = bucketName,
            InputStream = memoryStream,
            Name = objName
        };

        var result = await _storage.UploadFileAsync(s3Obj);
        if (result.StatusCode == StatusCodes.Status200OK)
        {
            string objectUrl = $"https://{_config["AwsConfiguration:BucketName"]}.s3.ap-southeast-1.amazonaws.com/{objName}";
            var attachResult = await _messageRepository.AddAttachmentAysnc(messageId, fileExtension, objectUrl, objName, width, height);
            if (attachResult.StatusCode == StatusCodes.Status200OK)
            {
                return Ok(attachResult);
            }
            else
            {
                return BadRequest(attachResult.Message);
            }
        }
        return Ok(result);
    }

    [HttpGet]
    [Route("attachment/download")]
    public async Task<IActionResult> DownloadFile(string fileName, int? width, int? height)
    {
        Stream fileStream = await _storage.DowloadFileAsync(_config["AwsConfiguration:BucketName"], fileName);
        try
        {
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
                case ".webp":
                    contentType = "image/webp";
                    break;
                case ".mp4":
                    contentType = "video/mp4";
                    break;
                default:
                    contentType = "application/octet-stream"; 
                    break;
            }
            int thumnailWidth = 0;
            int thumnailHeight = 0;
            if (width.HasValue && height.HasValue)
            {
                thumnailWidth = width.Value;
                thumnailHeight = height.Value;
            }
            else if (width.HasValue)
            {
                thumnailWidth = width.Value;
            }

            if(IsImage(fileName))
            {
                var resize = await _thumbnailGenerator.GenerateThumbnail(fileStream, thumnailWidth, thumnailHeight, Path.GetExtension(fileName));
                Response.Headers["Cache-Control"] = "public, max-age=86400";  //cache for image send to font-end
                return File(resize, contentType);
            }
            else if(IsVideo(fileName))
            {
                var thumbnail = await _thumbnailGenerator.GenerateVideoThumbnail(fileStream, thumnailWidth, thumnailHeight);
                Response.Headers["Cache-Control"] = "public, max-age=86400";
                return File(thumbnail, "image/webp");
            }
            return new EmptyResult();
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

    private bool IsImage(string fileName)
    {
        string[] imageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
        string extension = Path.GetExtension(fileName).ToLower();
        return imageExtensions.Contains(extension);
    }
    private bool IsVideo(string fileName)
    {
        string[] videoExtensions = { ".mp4", "webm" };
        string extension = Path.GetExtension(fileName).ToLower();
        return videoExtensions.Contains(extension);
    }

    private async Task<(int Width, int Height)> GetVideoDimensionsFromFFmpeg(Stream stream)
    {
        try
        {
            int width = 0;
            int height = 0;
            string customTempDirectory = @"D:\video";
            var tempFilePath = Path.Combine(customTempDirectory, Path.GetRandomFileName() + ".mp4");
            await using (var fileStream = new FileStream(tempFilePath, FileMode.Create, FileAccess.Write))
            {
                stream.Seek(0, SeekOrigin.Begin);
                await stream.CopyToAsync(fileStream);
            }
            var processStartInfo = new ProcessStartInfo
            {
                FileName = "ffprobe",
                Arguments = $"-v error -show_entries stream=width,height -of default=noprint_wrappers=1 {tempFilePath}",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                WorkingDirectory = "C:\\FFMPEG"
            };
            using (var process = Process.Start(processStartInfo))
            {
                if (process == null)
                {
                    throw new Exception("FFmpeg process could not be started.");
                }
                string output = await process.StandardOutput.ReadToEndAsync();
                await process.WaitForExitAsync();
                if (process.ExitCode == 0)
                {
                    string[] lines = output.Split('\n');
                    foreach(string line in lines)
                    {
                        string[] parts = line.Split('=');
                        if(parts.Length == 2 && parts[0] == "width")
                        {
                            int.TryParse(parts[1], out width);
                        }
                        else if(parts.Length == 2 && parts[0] == "height")
                        {
                            int.TryParse(parts[1], out height);
                        }
                    }
                    System.IO.File.Delete(tempFilePath);
                    return (width, height);
                }
                else
                {
                    string errorOutput = await process.StandardError.ReadToEndAsync();
                    throw new Exception($"FFmpeg execution failed with exit code {process.ExitCode}: {errorOutput}");
                }
            }
            throw new Exception("Failed to retrieve video dimensions.");
        } catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return (0, 0);
        }
    }
}
