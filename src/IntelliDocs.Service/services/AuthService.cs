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
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                IsAdmin = model.IsAdmin,
                CreatedAt = DateTime.Now
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
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, "User")
            };

            if (user.IsAdmin)
            {
                claims.Add(new Claim(ClaimTypes.Role, "Admin"));
            }

            var token = new JwtSecurityToken
            (
                 _configuration["JWT:Issuer"],
                _configuration["JWT:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );


            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<User?> SetAdminAsync(string email, bool isAdmin)
        {
            var user = await _repository.Users.GetUserByEmailAsync(email);

            if (user == null)
            {
                return null;
            }

            user.IsAdmin = isAdmin;
            await _repository.SaveAsync();

            return user;
        }

        public async Task<AuthResult> SetAdminAsync(SetAdminModel model)
        {
            var user = await _repository.Users.GetUserByEmailAsync(model.Email);

            if (user == null)
            {
                return new AuthResult { Succeeded = false, Errors = new List<string> { "User not found" } };
            }

            user.IsAdmin = model.IsAdmin;
            _repository.Users.UpdateAsync(user);
            await _repository.SaveAsync();

            return new AuthResult { Succeeded = true };
        }
    }
}
