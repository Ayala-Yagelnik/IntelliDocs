using AutoMapper;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth;

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

            try
            {
                if (model == null)
                    return BadRequest("User data is required.");
                var authResult = await _authService.RegisterAsync(model);
                if (!authResult.IsSuccess)
                {
                    return BadRequest(authResult.ErrorMessage);
                }
                Console.WriteLine("User registered successfully.");
                return Ok(authResult.Data);

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during registration: {ex.Message}");
                return StatusCode(500, "An error occurred during registration.");
            }
        }
        
        [HttpPost("google")]
        public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignInRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Token))
                {
                    return BadRequest(new { message = "Google token is required." });
                }
                // אימות הטוקן מול Google
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID") ?? "YOUR_GOOGLE_CLIENT_ID" } // Client ID שלך
                });

                // בדוק אם המשתמש כבר קיים במערכת
                var user = await _authService.GetOrCreateUserAsync(payload.Email, payload.Name, payload.Subject);

                // צור JWT Token עבור המשתמש
                var jwtToken = _authService.GenerateJwtToken(user);

                return Ok(new { user, token = jwtToken });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Google Sign-In Error: {ex.Message}");
                return Unauthorized(new { message = "Invalid Google token", error = ex.Message });
            }
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
public class GoogleSignInRequest
{
    public string Token { get; set; }
}