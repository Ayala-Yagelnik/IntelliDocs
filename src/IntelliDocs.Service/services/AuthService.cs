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
            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? throw new InvalidOperationException("JWT_KEY environment variable is not set.");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
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
                Environment.GetEnvironmentVariable("JWT_ISSUER"),
                Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
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

            await _repository.Users.UpdateAsync(user.Id, user);
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

            throw new InvalidOperationException("Invalid email or password.");
        }

        public async Task<Result<AuthResult>> LoginAsync(UserLoginModel model)
        {
            var user = await ValidateUser(model.Email, model.Password);
            if (user != null)
            {
                Console.WriteLine("Updating LastLogin...",user.LastLogin);
                user.LastLogin = DateTime.UtcNow;
                await _repository.Users.UpdateAsync(user.Id, user);
                await _repository.SaveAsync();
                Console.WriteLine("LastLogin updated successfully.",user.LastLogin);
                // Generate JWT token
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

            var result =await _repository.Users.AddAsync(user);
            if (result == null)
            {
                return Result<bool>.Failure("Failed to register user.");
            }

            await _repository.SaveAsync();
            return Result<bool>.Success(true);
        }


    }
}
