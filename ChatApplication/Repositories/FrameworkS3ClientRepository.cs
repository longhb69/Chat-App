using Amazon.Runtime;
using Amazon.S3;

namespace ChatApplication.Repositories;

public class FrameworkS3ClientRepository : IS3Client
{
    private readonly IConfiguration _config;

    public FrameworkS3ClientRepository(IConfiguration config)
    {
        _config = config;
    }

    public IAmazonS3 CreateS3Client()
    {
        var awsAccessKey = _config["AwsConfiguration:AWSAccessKey"];
        var awsSecretKey = _config["AwsConfiguration:AWSSecretKey"];
        var credentials = new BasicAWSCredentials(awsAccessKey, awsSecretKey);
        if (string.IsNullOrEmpty(awsAccessKey) || string.IsNullOrEmpty(awsSecretKey))
        {
            throw new InvalidOperationException("AWS access key and secret key are required.");
        }
        var config = new AmazonS3Config
        {
            RegionEndpoint = Amazon.RegionEndpoint.APSoutheast1
        };
        return new AmazonS3Client(credentials, config);
    }
}
