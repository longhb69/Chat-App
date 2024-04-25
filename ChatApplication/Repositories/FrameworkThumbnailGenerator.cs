using Microsoft.AspNetCore.Mvc;
using Microsoft.DiaSymReader;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Gif;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace ChatApplication.Repositories;

public class FrameworkThumbnailGenerator : IThumbnailGenerator
{
    private static IImageEncoder GetEncoder(string extension)
    {
        IImageEncoder encoder = null;

        extension = extension.Replace(".", "");

        var isSupported = Regex.IsMatch(extension, "gif|png|jpe?g|webp", RegexOptions.IgnoreCase);

        if (isSupported)
        {
            switch (extension.ToLower())
            {
                case "png":
                    encoder = new PngEncoder();
                    break;
                case "jpg":
                    encoder = new JpegEncoder();
                    break;
                case "jpeg":
                    encoder = new JpegEncoder();
                    break;
                case "webp":
                    encoder = new WebpEncoder();
                    break;
                case "gif":
                    encoder = new GifEncoder();
                    break;
                default:
                    break;
            }
        }
        return encoder;
    }
    public async Task<Stream> GenerateThumbnail(Stream fileStream, int width, int height, string extension)
    {
        var encoder = GetEncoder(extension);
        var output = new MemoryStream();
        using (Image image = await Image.LoadAsync(fileStream))
        {
            var divisor = (double)image.Width / width;
            int _height;

            if(height == 0) 
            {
                _height = Convert.ToInt32(Math.Round((decimal)(image.Height / divisor)));
                image.Mutate(x => x.Resize(width, _height)); //this keep aspect raito
                image.Save(output, encoder);
            }
            else
            {
                _height = height;
                image.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new Size(width, height),
                    Mode = ResizeMode.Crop // This will crop the image to the specified dimensions
                }));;
            }
            image.Save(output, encoder);
            output.Position = 0;
            return output;
        }
    }
    public async Task<Stream> GenerateVideoThumbnail(Stream stream, int targetWidth, int targetHeight)
    {
        if(stream == null || targetWidth <= 0)
        {
            throw new ArgumentException("Invalid input parameters");
        }
        string customTempDirectory = @"D:\video";
        var tempInputFilePath = Path.Combine(customTempDirectory, Path.GetRandomFileName() + "input.mp4");
        var tempOutputFilePath = Path.Combine(customTempDirectory, Path.GetRandomFileName() + "output.webp");

        try
        {
            await using (var filestream = new FileStream(tempInputFilePath, FileMode.Create, FileAccess.Write))
            {
                byte[] buffer = new byte[81920];
                int bytesRead;
                long totalBytesRead = 0;
                int targetByte = 2000000;
                while (totalBytesRead <= targetByte && (bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length)) > 0)
                {
                    await filestream.WriteAsync(buffer, 0, bytesRead);
                    totalBytesRead += bytesRead;
                }
            }
            var processStartInfo = new ProcessStartInfo
            {
                FileName = "ffmpeg",
                Arguments = $"-i \"{tempInputFilePath}\" -vf scale={targetWidth}:-1 -ss 00:00:00 -vframes 1 \"{tempOutputFilePath}\"",
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
                await process.WaitForExitAsync();
            }
            using (var thumbnailFileStream = new FileStream(tempOutputFilePath, FileMode.Open, FileAccess.Read))
            {
                var thumbnailStream = new MemoryStream();
                await thumbnailFileStream.CopyToAsync(thumbnailStream);
                thumbnailStream.Seek(0, SeekOrigin.Begin);
                return thumbnailStream;
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if(File.Exists(tempOutputFilePath))
            {
                File.Delete(tempOutputFilePath);
            }
            if(File.Exists(tempInputFilePath))
            {
                File.Delete(tempInputFilePath);
            }
        }
    }
}
