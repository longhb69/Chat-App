using ChatApplication.Models;
using ChatApplication.Respone;
using Microsoft.AspNetCore.Mvc;

namespace ChatApplication.Repositories;

public interface IStorage
{
    Task<S3Respone> UploadFileAsync(S3Object s3obj);
    Task<Stream> DowloadFileAsync(string bucketName, string key);
}
