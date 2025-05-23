using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IntelliDocs.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoldersController : ControllerBase
    {
        private readonly IFolderService _folderService;
        private readonly IUserFileService _fileService;

        public FoldersController(IFolderService folderService,IUserFileService fileService)
        {
            _folderService = folderService;
            _fileService = fileService;
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateFolder([FromBody] FolderDTO folderDTO)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var folder = new Folder
            {
                Name = folderDTO.Name,
                ParentFolderId = folderDTO.ParentFolderId,
                OwnerId = folderDTO.OwnerId,
                CreatedAt = DateTime.UtcNow.AddHours(3),
                SubFolders = new List<Folder>(),
                Files = new List<UserFile>()
            };
            var createdFolder = await _folderService.CreateFolderAsync(folder);
            return Ok(createdFolder);
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFolderById(int id)
        {
            var folder = await _folderService.GetFolderByIdAsync(id);
            if (folder == null) return NotFound();
            return Ok(folder);
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFolder(int id)
        {
            var result = await _folderService.DeleteFolderAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
        //TODO: ??? למה יש 2 מתודות עם אותו שם?? לבדוק אם זה לא טעות
        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("{id}/contents")]
        public async Task<IActionResult> GetFolderContents(int id)
        {

            // try
            // {
            //     var rootFolders = await _folderService.GetSubFoldersAsync(null, userId);
            //     var rootFiles = await _fileService.GetFilesInFolderAsync(null,userId);
            //     return Ok(new{ Folders = rootFolders, Files = rootFiles });
            // }
            // catch (Exception ex)
            // {
            //     Console.WriteLine($"Error in GetRootContents: {ex.Message}");
            //     return StatusCode(500, "An error occurred while fetching root contents.");
            // }
            var folder = await _folderService.GetFolderByIdAsync(id);
            if (folder == null) return NotFound();

            var contents = new
            {
                SubFolders = folder.SubFolders.Where(f => f.IsDeletted == false).ToList(),
                Files = folder.Files
            };

            return Ok(contents);
        }

        [HttpGet("contents")]
        public async Task<IActionResult> GetFolderContents(int userId, int? parentFolderId)
        {
            if (parentFolderId == null)
            {
                var rootFolders = await _folderService.GetSubFoldersAsync(null, userId);
                var rootFiles = await _fileService.GetFilesInFolderAsync(null, userId, false);
                return Ok(new { Folders = rootFolders, Files = rootFiles });
            }

            // החזרת תוכן של תיקיה ספציפית
            var folder = await _folderService.GetFolderByIdAsync(parentFolderId.Value);
            if (folder == null) return NotFound();

            return Ok(new { Folders = folder.SubFolders, Files = folder.Files });
        }

  
        [Authorize(Policy = "UserOrAdmin")]
        [HttpDelete("{id}/trash")]
        public async Task<IActionResult> MoveFolderToTrash(int id)
        {
            await _folderService.MoveFolderToTrashAsync(id);
            return NoContent();
        }

     
    }
}
