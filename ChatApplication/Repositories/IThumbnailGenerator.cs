namespace ChatApplication.Repositories;

public interface IThumbnailGenerator
{
    Task<Stream> GenerateThumbnail(Stream fileStream, int width, int height, string extension);
    Task<Stream> GenerateVideoThumbnail(Stream fileStream, int targetWidth, int targetHeight);
}

