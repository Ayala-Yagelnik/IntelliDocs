using AutoMapper;
using IntelliDocs.Core.IServices;
using IntelliDocs.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntelliDocs.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        public AuthController(IAuthService authService, IMapper mapper)
        {
            _authService = authService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterModel model)
        {
            if (model == null)
                return BadRequest("User data is required.");
            var authResult = await _authService.RegisterAsync(model);

            if (!authResult.Succeeded)
            {
                return BadRequest(authResult.Errors);
            }

            return Ok(new { Token = authResult.Token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel model)
        {
            var authResult = await _authService.LoginAsync(model);

            if (!authResult.Succeeded)
            {
                return Unauthorized(authResult.Errors);
            }

            return Ok(new { Token = authResult.Token });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("setAdmin")]
        public async Task<IActionResult> SetAdmin([FromBody] SetAdminModel model)
        {
            var user = await _authService.SetAdminAsync(model);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }
    }


}
