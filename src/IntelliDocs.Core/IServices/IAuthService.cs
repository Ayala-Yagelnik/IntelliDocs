using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;

namespace IntelliDocs.Core.IServices
{
    public interface IAuthService
    {
        string GenerateJwtToken(User user);
        Task<User> ValidateUser(string email, string password);

        Task<Result<AuthResult>> LoginAsync(UserLoginModel model);
        Task<Result<bool>> RegisterAsync(UserRegisterModel model);
        Task<Result<bool>> SetAdminAsync(SetAdminModel model);
        Task<User> GetOrCreateUserAsync(string email, string name, string googleId);
    }
}
