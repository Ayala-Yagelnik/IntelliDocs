using AutoMapper;
using IntelliDocs.API.PostEntity;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IntelliDocs.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        private readonly IMapper _mapper;

        public RoleController(IRoleService iService, IMapper mapper)
        {
            _roleService = iService;
            _mapper = mapper;
        }

        //[Authorize(Policy = "AdminOnly")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDTO>>> Get()
        {
            var roles = await _roleService.GetAllRoles();
            return roles == null ? NotFound() : Ok(roles);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDTO>> Get(int id)
        {
            var role = await _roleService.GetRoleById(id);
            return role == null ? NotFound() : Ok(role);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<ActionResult<RoleDTO>> Post([FromBody] RolePost rolePostModel)
        {
            var roleDto = _mapper.Map<RoleDTO>(rolePostModel);
            roleDto = await _roleService.AddRole(roleDto);
            return roleDto == null ? NotFound() : Ok(roleDto);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> Put(int id, [FromBody] RolePost rolePostModel)
        {
            var roleDto = _mapper.Map<RoleDTO>(rolePostModel);
            roleDto = await _roleService.UpdateRole(id, roleDto);
            return roleDto == null ? NotFound() : Ok(roleDto);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            return await _roleService.DeleteRole(id) ? Ok(true) : NotFound();
        }
    }
}
