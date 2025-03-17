using AutoMapper;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IServices;
using IntelliDocs.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Amazon.S3;
using Amazon.S3.Model;

namespace IntelliDocs.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IUserFileService _userFileService;
        private readonly IS3Service _s3Service;
        private readonly IAmazonS3 _s3Client;

        public FilesController(IUserFileService fileService, IS3Service s3Server, IAmazonS3 s3Client)
        {
            _userFileService = fileService;
            _s3Service = s3Server;
            _s3Client = s3Client;
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("upload-url")]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            if (string.IsNullOrEmpty(fileName) || string.IsNullOrEmpty(contentType))
                return BadRequest("Missing file name or content type");

            var url = await _s3Service.GeneratePresignedUrlAsync(fileName, contentType);
            return Ok(new { url });
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
        {
            try
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = "intellidocs3",
                    Key = fileName,
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(5),
                    ContentType = "application/octet-stream"
                };
                try
                {
                    var presignedUrl = _s3Client.GetPreSignedURL(request);
                    Console.WriteLine($"Generated presigned URL: {presignedUrl}");
                    return Ok(new { url = presignedUrl });
                }
                catch (AmazonS3Exception ex)
                {
                    Console.WriteLine($"S3 Error: {ex.Message}");
                    return StatusCode(500, $"Error creating presigned URL: {ex.Message}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"General Error: {ex.Message}");
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"Error creating presigned URL: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("download-url/{fileName}")]
        public async Task<IActionResult> GetDownloadUrl(string fileName)
        {
            var url = await _s3Service.GetDownloadUrlAsync(fileName);
            return Ok(new { downloadUrl = url });
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpPost("share")]
        public async Task<IActionResult> ShareFile(int fileId, int userId)
        {
            await _userFileService.ShareFileAsync(fileId, userId);
            return Ok();
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("search")]
        public async Task<IActionResult> SearchFiles(string query, int userId)
        {
            var files = await _userFileService.SearchFilesAsync(query, userId);
            return Ok(files);
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            return await _userFileService.DeleteFileAsync(id) ? Ok(true) : NotFound();
        }
    }
}