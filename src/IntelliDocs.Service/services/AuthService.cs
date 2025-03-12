using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using IntelliDocs.Core.IServices;
using IntelliDocs.Core.Models;
using IntelliDocs.Core.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace IntelliDocs.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly IRepositoryManager _repository;
        private readonly IConfiguration _configuration;

        public AuthService(IRepositoryManager repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
        }

        public async Task<AuthResult> RegisterAsync(UserRegisterModel model)
        {
            if (await _repository.Users.ExistsByEmailAsync(model.Email))
            {
                return new AuthResult { Succeeded = false, Errors = new List<string> { "Email already exists" } };
            }

            var newUser = new User
            {
                Email = model.Email,
                Username = model.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password)
            };

            await _repository.Users.AddAsync(newUser);
            await _repository.SaveAsync();

            var token = GenerateJwtToken(newUser);
            return new AuthResult { Succeeded = true, Token = token };
        }

        public async Task<AuthResult> LoginAsync(UserLoginModel model)
        {
            var user = await _repository.Users.GetUserByEmailAsync(model.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            {
                return new AuthResult { Succeeded = false, Errors = new List<string> { "Invalid email or password" } };
            }

            var token = GenerateJwtToken(user);
            return new AuthResult { Succeeded = true, Token = token };

        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JWT:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["JWT:Issuer"],
                Audience = _configuration["JWT:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}
