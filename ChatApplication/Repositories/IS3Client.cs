using Amazon.S3;

namespace ChatApplication.Repositories;

public interface IS3Client
{
    public IAmazonS3 CreateS3Client();
}
