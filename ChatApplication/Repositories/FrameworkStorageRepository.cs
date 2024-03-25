
using ChatApplication.Models;
using ChatApplication.Respone;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ChatApplication.Repositories;

public class FrameworkStorageRepository : IStorage
{
    private readonly IS3Client _s3Client;
    public FrameworkStorageRepository(IS3Client s3Client)
    {
        this._s3Client = s3Client;
    }
    public async Task<S3Respone> UploadFileAsync(Models.S3Object s3obj)
    {
        var response = new S3Respone();
        try
        {
            var uploadRequest = new TransferUtilityUploadRequest()
            {
                InputStream = s3obj.InputStream,
                Key = s3obj.Name,
                BucketName = s3obj.BucketName,
                CannedACL = S3CannedACL.PublicRead,
            };

            //using var client = new AmazonS3Client(credentials,config);
            using var client = _s3Client.CreateS3Client();

            var transferUtiltiy = new TransferUtility(client);
            await transferUtiltiy.UploadAsync(uploadRequest);

            response.StatusCode = StatusCodes.Status200OK;
            response.Message = $"{s3obj.Name} has been uploaded successfully";
        } 
        catch(AmazonS3Exception ex)
        {
            response.StatusCode = (int)ex.StatusCode;
            response.Message = ex.Message;
        }
        catch (Exception ex)
        {
            response.StatusCode = StatusCodes.Status500InternalServerError;
            response.Message = ex.Message;
        }
        return response;
    }
    public async Task<Stream> DowloadFileAsync(string bucketName, string key)
    {
       try
        {
            var request = new GetObjectRequest
            {
                BucketName = bucketName,
                Key = key
            };
            using var client = _s3Client.CreateS3Client();
            var transerUtility = new TransferUtility(client);
            var respone = await transerUtility.S3Client.GetObjectAsync(request);

            return respone.ResponseStream;

       }
        catch (AmazonS3Exception ex)
        {
            Console.WriteLine($"Error getting object {key} from bucket {bucketName}: {ex.Message}");
            throw;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting object {key} from bucket {bucketName}: {ex.Message}");
            throw;
        }
    }

}
