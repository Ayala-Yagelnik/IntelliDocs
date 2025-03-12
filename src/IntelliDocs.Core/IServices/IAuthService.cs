using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IntelliDocs.Core.Entities;
using IntelliDocs.Core.Models;

namespace IntelliDocs.Core.IServices
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(UserLoginModel model);
        Task<AuthResult> RegisterAsync(UserRegisterModel model);
        Task<AuthResult> SetAdminAsync(SetAdminModel model);
    }
}
