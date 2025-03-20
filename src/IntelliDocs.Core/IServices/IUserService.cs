using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDTO>> GetAllAsync();
        Task<UserDTO> GetByIdAsync(int id);
        Task<UserDTO> AddAsync(UserDTO user);
        Task<UserDTO> UpdateAsync(int id, UserDTO user);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<FileDTO>> GetUserFilesByUserIdAsync(int userId);
        Task<bool> ReactivateUserAsync(int id);
        Task<List<UserStorageDto>> GetUserStorageUsageAsync();

    }
}
