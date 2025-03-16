using AutoMapper;
using IntelliDocs.API.PostEntity;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntelliDocs.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionService _permissionService;
        private readonly IMapper _mapper;

        public PermissionController(IPermissionService iService, IMapper mapper)
        {
            _permissionService = iService;
            _mapper = mapper;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PermissionDTO>>> Get()
        {
            var permissions = await _permissionService.GetAllPermissions();
            return permissions == null ? NotFound() : Ok(permissions);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("{id}")]
        public async Task<ActionResult<PermissionDTO>> Get(int id)
        {
            var permission = await _permissionService.GetPermissionById(id);
            return permission == null ? NotFound() : Ok(permission);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<ActionResult<PermissionDTO>> Post([FromBody] PermissionPost permissionPostModel)
        {
            var permissionDto = _mapper.Map<PermissionDTO>(permissionPostModel);
            permissionDto = await _permissionService.AddPermission(permissionDto);
            return permissionDto == null ? NotFound() : Ok(permissionDto);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> Put(int id, [FromBody] PermissionPost permissionPostModel)
        {
            var permissionDto = _mapper.Map<PermissionDTO>(permissionPostModel);
            permissionDto = await _permissionService.UpdatePermission(id, permissionDto);
            return permissionDto == null ? NotFound() : Ok(permissionDto);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            return await _permissionService.DeletePermission(id) ? Ok(true) : NotFound();
        }
    }
}
