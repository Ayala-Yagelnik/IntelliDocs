using Amazon.S3;
using Amazon.S3.Model;
using IntelliDocs.Core.IServices;
using Microsoft.Extensions.Configuration;

namespace IntelliDocs.Service.Services
{
    public class S3Service : IS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public S3Service(IConfiguration configuration)
        {
            var awsOptions = configuration.GetSection("AWS");
            var accessKey = awsOptions["AccessKey"];
            var secretKey = awsOptions["SecretKey"];
            var region = awsOptions["Region"];
            _bucketName = awsOptions["BucketName"] ?? throw new ArgumentNullException("AWS BucketName is missing");
            
            if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(region))
            {
                throw new ArgumentNullException("AWS credentials or region are missing");
            }
            _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(region));
        }

        public async Task<string> GeneratePresignedUrlAsync(string fileName, string contentType)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(10),
                ContentType = contentType
            };

            return await Task.FromResult(_s3Client.GetPreSignedURL(request));
        }

        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(30)
            };

            return await Task.FromResult(_s3Client.GetPreSignedURL(request));
        }
    }
}