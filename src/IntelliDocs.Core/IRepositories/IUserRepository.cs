using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.IRepositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetUserByEmailAsync(string email);
        Task<bool> ExistsByEmailAsync(string email);
        Task<bool> ReactivateAsync(int id);
        Task<List<UserStorageDto>> GetUserStorageUsageAsync();
        Task<List<UserFile>> GetSharedFilesAsync(int userId);
    }
}
