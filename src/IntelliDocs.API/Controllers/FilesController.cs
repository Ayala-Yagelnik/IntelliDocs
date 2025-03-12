using IntelliDocs.Core.Entities;
using IntelliDocs.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IntelliDocs.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IUserFileService _userFileService;

        public FilesController(IUserFileService fileService)
        {
            _userFileService = fileService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromBody] UserFile file)
        {
           if (file == null || file.FileSize == 0)
            return BadRequest("File not provided");

            await _userFileService.UploadFileAsync(file);
            return Ok();
        }

        [HttpPost("share")]
        public async Task<IActionResult> ShareFile(int fileId, int userId)
        {
            await _userFileService.ShareFileAsync(fileId, userId);
            return Ok();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchFiles(string query, int userId)
        {
            var files = await _userFileService.SearchFilesAsync(query, userId);
            return Ok(files);
        }
    }
}
