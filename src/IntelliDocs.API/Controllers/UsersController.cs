using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using IntelliDocs.Core.Services;
using IntelliDocs.Core.DTOs;
using IntelliDocs.API.PostEntity;
using AutoMapper;

namespace IntelliDocs.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        readonly IMapper _mapper;

        public UsersController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet]
        public async Task<ActionResult<List<UserDTO>>> Get()
        {
            var users = await _userService.GetAllAsync();
            return users == null ? NotFound() : Ok(users);
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> Get(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            return user == null ? NotFound() : Ok(user);
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpPost]
        public async Task<ActionResult<UserDTO>> Post([FromBody] UserPost user)
        {
            var dto = _mapper.Map<UserDTO>(user);
            var newUser = await _userService.AddAsync(dto);
            return newUser == null ? BadRequest(newUser) : Ok(newUser);
        }

        [Authorize(Policy = "UserOrAdmin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDTO>> Put(int id, [FromBody] UserPost user)
        {
            var dto = _mapper.Map<UserDTO>(user);
            var updatedUser = await _userService.UpdateAsync(id, dto);
            return updatedUser == null ? NotFound() : Ok(updatedUser);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            return await _userService.DeleteAsync(id) ? Ok() : NotFound();
        }
    }
}
