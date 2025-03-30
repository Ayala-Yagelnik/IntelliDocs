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

        public FoldersController(IFolderService folderService)
        {
            _folderService = folderService;
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateFolder([FromBody] Folder folder)
        {
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
        [HttpGet("{parentId}/subfolders")]
        public async Task<IActionResult> GetSubFolders(int parentId)
        {
            var subFolders = await _folderService.GetSubFoldersAsync(parentId);
            return Ok(subFolders);
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFolder(int id)
        {
            var result = await _folderService.DeleteFolderAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("{id}/contents")]
        public async Task<IActionResult> GetFolderContents(int id)
        {
            var folder = await _folderService.GetFolderByIdAsync(id);
            if (folder == null) return NotFound();

            var contents = new
            {
                SubFolders = folder.SubFolders,
                Files = folder.Files
            };

            return Ok(contents);
        }
    }
}
