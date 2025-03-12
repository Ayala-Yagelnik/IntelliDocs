using IntelliDocs.Core.Entities;
using IntelliDocs.Core.Services;
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

// [HttpPost("register")]
//     public async Task<IActionResult> Register(User user)
//     {
//         user.Password = user.Password;
//         DataContext.Users.Add(user);
//         await _context.SaveChangesAsync();
//         return Ok(user);
//     }

    // [HttpPost("login")]
    // public async Task<IActionResult> Login(User loginRequest)
    // {
    //     var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);
    //     if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.PasswordHash, user.PasswordHash))
    //     {
    //         return Unauthorized("Invalid credentials");
    //     }
    //     return Ok(user);
    // }



        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginModel model)
        {
            var token = _authService.Authenticate(model.Username, model.Password);

            if (token == null)
                return Unauthorized();

            return Ok(new { Token = token });
        }
    }

    public class UserLoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
