using AutoMapper;
using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IServices;
using IntelliDocs.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IntelliDocs.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IUserFileService _userFileService;
        private readonly IMapper _mapper;

        public FilesController(IUserFileService fileService, IMapper mapper)
        {
            _userFileService = fileService;
            _mapper = mapper;
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromBody] UserFile file)
        {
            if (file == null || file.FileSize == 0)
                return BadRequest("File not provided");

            await _userFileService.UploadFileAsync(file);
            return Ok();
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
