using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IServices;
using IntelliDocs.Core.Models;
using IntelliDocs.Data;
using Microsoft.AspNetCore.Mvc;

namespace IntelliDocs.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterModel model)
        {
            var user = new UserRegisterModel
            {
                Username = model.Username,
                Email = model.Email,
                Password = model.Password
            };

            await _authService.RegisterAsync(user);
            return Ok(user);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginModel model)
        {
            var token = _authService.LoginAsync(model);

            if (token == null)
                return Unauthorized();

            return Ok(new { Token = token });
        }
    }


}
