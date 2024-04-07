using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Gif;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
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

        var isSupported = Regex.IsMatch(extension, "gif|png|jpe?g", RegexOptions.IgnoreCase);

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
    public async Task<Stream> GenerateVideoThumbnail(Stream fileStream, int targetWidth, int targetHeight)
    {
        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = "ffmpeg",
                Arguments = $"-i pipe: -vf scale=550:350,setsar=1 output.mp4",
                UseShellExecute = false,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                CreateNoWindow = true
            }
        };

        process.Start();
        //MemoryStream imageStream = new MemoryStream();
        //using (var outputStream = process.StandardOutput.BaseStream)
        //{
        //    outputStream.CopyTo(imageStream);
        //}
        Console.WriteLine("Start");
        process.WaitForExit();
        process.Close();
        Console.WriteLine("Done");
        //imageStream.Seek(0, SeekOrigin.Begin);
        return fileStream;
    }
}
