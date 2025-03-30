using AutoMapper;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.IServices;
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

            if (!authResult.IsSuccess)
            {
                return BadRequest(authResult.ErrorMessage);
            }

            return Ok(authResult.Data);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel model)
        {
            try
            {
                var authResult = await _authService.LoginAsync(model);
                return Ok(authResult.Data);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error: {ex.Message}");
                return StatusCode(500, "An unexpected error occurred.");
            }
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
