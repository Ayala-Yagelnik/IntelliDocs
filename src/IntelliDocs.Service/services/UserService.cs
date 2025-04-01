using AutoMapper;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using IntelliDocs.Core.Services;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Service.Services
{
    public class UserService : IUserService
    {
        private readonly IRepositoryManager _repository;
        readonly IMapper _mapper;
        public UserService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDTO>> GetAllAsync()
        {
            var users = await _repository.Users.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDTO>>(users);
        }

        public async Task<UserDTO> GetByIdAsync(int id)
        {
            var item = await _repository.Users.GetByIdAsync(id);
            return _mapper.Map<UserDTO>(item);
        }

        public async Task<UserDTO> AddAsync(UserDTO user)
        {
            var role = await _repository.Roles.GetRoleByName("User");
            if (role == null)
            {
                throw new InvalidOperationException("Role does not exist.");
            }

            var userEntity = _mapper.Map<User>(user);
            userEntity.Role = role;

            await _repository.Users.AddAsync(userEntity);
            await _repository.SaveAsync();
            Console.WriteLine($"User {userEntity.Email} created successfully with ID {userEntity.Id}");
            return _mapper.Map<UserDTO>(userEntity);
        }

        public async Task<UserDTO> UpdateAsync(int id, UserDTO user)
        {
            var model = _mapper.Map<User>(user);
            var updated = _repository.Users.UpdateAsync(id, model);
            if (updated == null)
                return null;
            await _repository.SaveAsync();
            return _mapper.Map<UserDTO>(updated);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            bool success = await _repository.Users.DeleteAsync(id);
            if (success)
                await _repository.SaveAsync();
            return success;
        }

        public async Task<IEnumerable<FileDTO>> GetUserFilesByUserIdAsync(int userId)
        {
            var files = await _repository.Files.GetFilesByUserIdAsync(userId);
            if (files == null)
            {
                return null;
            }
            return _mapper.Map<List<FileDTO>>(files);
        }

        public async Task<bool> ReactivateUserAsync(int id)
        {
            var result = await _repository.Users.ReactivateAsync(id);
            if (result)
            {
                await _repository.SaveAsync();
            }
            return result;
        }
        public async Task<List<UserStorageDto>> GetUserStorageUsageAsync()
        {
            var users = await _repository.Users.GetAllAsync();
            var storageUsage = users.Select(user => new UserStorageDto
            {
                Username = user.Username,
                Email = user.Email,
                StorageUsed = user.CreatedFiles?.Sum(file => file.FileSize) ?? 0 / (1024.0 * 1024.0)
            }).ToList();

            return storageUsage;
        }

        public async Task<IEnumerable<UserFile>> GetSharedFilesAsync(int userId)
        {
            var files = await _repository.Users.GetSharedFilesAsync(userId);
            if (files == null)
            {
                return null;
            }
            return files;
        }


    }
}
