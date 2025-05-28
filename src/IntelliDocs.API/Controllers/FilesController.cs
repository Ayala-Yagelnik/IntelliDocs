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
using IntelliDocs.API.PostEntity;
using IntelliDocs.Service.Services;
using IntelliDocs.Data;
using Microsoft.EntityFrameworkCore;

namespace IntelliDocs.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IUserService _usersService;
        private readonly IUserFileService _userFileService;
        private readonly IEmbeddingService _embeddingService;
        private readonly IS3Service _s3Service;
        private readonly IAmazonS3 _s3Client;
        private readonly IEmailService _emailService;


        public FilesController(
            IUserService userService,
            IUserFileService fileService,
            IS3Service s3Server,
            IAmazonS3 s3Client,
            IEmbeddingService embeddingService,
            IEmailService emailService)
        {
            _usersService = userService;
            _userFileService = fileService;
            _s3Service = s3Server;
            _s3Client = s3Client;
            _embeddingService = embeddingService;
            _emailService = emailService;
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("user-files/{userId}")]
        public async Task<IActionResult> GetUserFiles(int userId)
        {
            try
            {
                var files = await _userFileService.GetFilesByUserIdAsync(userId, false);
                var filesWithAuthors = files.Select(file => new
                {
                    file.Id,
                    file.FileName,
                    file.FileSize,
                    file.FileType,
                    file.UploadDate,
                    file.AuthorId,
                    file.FileKey,
                    Author = file.Author != null ? new AuthorDTO
                    {
                        Id = file.Author.Id,
                        Username = file.Author.Username,
                        Email = file.Author.Email
                    } : null
                });

                return Ok(filesWithAuthors);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching files for user {userId}: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching user files.");
            }
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("shared-files/{userId}")]
        public async Task<IActionResult> GetSharedFiles(int userId)
        {
            try
            {
                var sharedFiles = await _userFileService.GetSharedFilesAsync(userId);
                if (sharedFiles == null || !sharedFiles.Any())
                {
                    return NotFound("No shared files found.");
                }

                return Ok(sharedFiles);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching shared files for user {userId}: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching user files.");
            }
        }


        [Authorize(Policy = "UserOrAdmin")]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromBody] FileDTO fileDto)
        {
            Console.WriteLine($"Received FileDTO: {System.Text.Json.JsonSerializer.Serialize(fileDto)}");

            if (fileDto == null || string.IsNullOrEmpty(fileDto.FileName))
            {
                Console.WriteLine("Bad Request: Invalid file data.");
                return BadRequest("Invalid file data.");
            }
            try
            {
                var savedFile = await _userFileService.UploadFileAsync(fileDto);
                return Ok(savedFile);
            }
            catch (DbUpdateException ex)
            {
                // Log the exception for debugging
                Console.WriteLine($"Database update error: {ex.Message}");
                return StatusCode(500, "An error occurred while saving the file metadata.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error: {ex.Message}");
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("upload-url")]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            Console.WriteLine($"Generating upload URL for file: {fileName} with content type: {contentType}");
            if (string.IsNullOrEmpty(fileName) || string.IsNullOrEmpty(contentType))
                return BadRequest("Missing file name or content type");
            var userName = HttpContext?.User?.Identity?.Name;
            var url = await _s3Service.GeneratePresignedUrlAsync($"{userName}/{fileName}", contentType);
            return Ok(new { url });
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("download-url")]
        public async Task<IActionResult> GetDownloadUrl([FromQuery] string filekey)
        {
            if (string.IsNullOrEmpty(filekey))
            {
                return BadRequest("File name is required.");
            }

            try
            {
                var url = await _s3Service.GetDownloadUrlAsync(filekey);
                return Ok(new { presignedUrl = url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error generating pre-signed URL: {ex.Message}");
            }
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpPost("share")]
        public async Task<IActionResult> ShareFile([FromBody] ShareFileRequest request)
        {
            Console.WriteLine($"Attempting to share file with ID: {request.FileId} for email: {request.Email}");
            await _userFileService.ShareFileAsync(request.FileId, request.Email);

            var file = await _userFileService.GetFileById(request.FileId);
            var sender = await _usersService.GetByIdAsync(file.AuthorId);

            var fileUrl = $"https://intellidocs-client-app.onrender.com/files-shared";

            await _emailService.SendFileShareEmailAsync(
                request.Email,
                sender?.Username ?? "Someone",
                file.FileName,
                DateTime.Now,
                fileUrl
            );

            return Ok();
        }
        [Authorize(Policy = "UserOrAdmin")]
        [HttpPost("search")]
        public async Task<IActionResult> SearchFiles(string query, int userId)
        {
            try
            {
                // קבלת הווקטור לשאילתה
                var embedding = await _embeddingService.GetEmbeddingAsync(query);

                // חיפוש קבצים מבוסס embedding
                var files = await _userFileService.SearchFilesByEmbeddingAsync(embedding, userId);

                if (!files.Any())
                {
                    return NotFound("No files match the query.");
                }

                return Ok(files);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error searching files for user {userId}: {ex.Message}");
                return StatusCode(500, "An error occurred while searching files.");
            }
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            return await _userFileService.DeleteFileAsync(id) ? Ok(true) : NotFound();
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("total-storage")]
        public async Task<IActionResult> GetTotalStorageUsed()
        {
            var totalStorageInGB = await _userFileService.GetTotalStorageUsedAsync();
            return Ok(new { totalStorageInGB });
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpPatch("{id}/star")]
        public async Task<IActionResult> ToggleStarFile(int id, [FromBody] bool isStarred)
        {
            try
            {
                Console.WriteLine($"File ID: {id}, Is Starred: {isStarred}");
                await _userFileService.ToggleStarFileAsync(id, isStarred);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error starring file: {ex.Message}");
                return StatusCode(500, "An error occurred while starring the file.");
            }
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("trash/{userId}")]
        public async Task<IActionResult> GetTrashFiles(int userId)
        {
            var trashedFiles = await _userFileService.GetTrashFilesAsync(userId);
            return Ok(trashedFiles);
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpDelete("{id}/trash")]
        public async Task<IActionResult> MoveFileToTrash(int id)
        {
            await _userFileService.MoveFileToTrashAsync(id);
            return NoContent();
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpDelete("{id}/permanent")]
        public async Task<IActionResult> PermanentlyDeleteFile(int id)
        {
            var success = await _userFileService.PermanentlyDeleteFileAsync(id);
            return success ? NoContent() : NotFound();
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpPatch("{id}/restore")]
        public async Task<IActionResult> RestoreFile(int id)
        {
            var success = await _userFileService.RestoreFileAsync(id);
            return success ? NoContent() : NotFound();
        }


    }
}