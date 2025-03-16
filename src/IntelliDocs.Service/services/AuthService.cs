using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IntelliDocs.Core;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using IntelliDocs.Core.IServices;
using IntelliDocs.Core.Services;
using IntelliDocs.Data.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;


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

        public string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            if (user.Role != null)
            {
                claims.Add(new Claim(ClaimTypes.Role, user.Role.NameRole));
            }
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<Result<bool>> SetAdminAsync(SetAdminModel model)
        {
            var user = await _repository.Users.GetUserByEmailAsync(model.Email);

            if (user == null)
            {
                return Result<bool>.Failure("User not found");
            }

            _repository.Users.UpdateAsync(user.Id, user);
            await _repository.SaveAsync();

            return Result<bool>.Success(true);
        }

        public async Task<User> ValidateUser(string email, string password)
        {
            User user = await _repository.Users.GetUserByEmailAsync(email);
            if (user != null)
            {
                user.Role = await _repository.Roles.GetByIdAsync(user.RoleId);
                if (BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                {
                    return user;
                }
            }

            return null;
        }

        public async Task<Result<AuthResult>> LoginAsync(UserLoginModel model)
        {
            User user = await ValidateUser(model.Email, model.Password);
            if (user != null)
            {
                var token = GenerateJwtToken(user);
                var userDto = new UserDTO
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role.Id
                };
                var response = new AuthResult
                {
                    User = userDto,
                    Token = token
                };
                return Result<AuthResult>.Success(response);
            }

            return Result<AuthResult>.Failure("Invalid username or password.");
        }

        public async Task<Result<bool>> RegisterAsync(UserRegisterModel model)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
            var role = await _repository.Roles.GetByIdAsync(model.Role);

            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                PasswordHash = hashedPassword,
                AccountStatus = "Active",
                CreatedAt = DateTime.UtcNow,
                Role = role
            };

            if (await _repository.Users.GetUserByEmailAsync(user.Email) != null)
            {
                return Result<bool>.Failure("Email already exists");
            }

            var result = _repository.Users.AddAsync(user);
            if (result == null)
            {
                return Result<bool>.Failure("Failed to register user.");
            }

            await _repository.SaveAsync();
            return Result<bool>.Success(true);
        }


    }
}
