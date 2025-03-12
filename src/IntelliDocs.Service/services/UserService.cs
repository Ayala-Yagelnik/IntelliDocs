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

        public async Task<List<UserDTO>> GetAllAsync()
        {
            var users = await _repository.Users.GetListAsync();
            return _mapper.Map<List<UserDTO>>(users);
        }

        public async Task<UserDTO> GetByIdAsync(int id)
        {
            var item = await _repository.Users.GetByIdAsync(id);
            return _mapper.Map<UserDTO>(item);
        }

        public async Task<UserDTO> AddAsync(UserDTO user)
        {
            var model = _mapper.Map<User>(user);
            await _repository.Users.AddAsync(model);
            await _repository.SaveAsync();
            return _mapper.Map<UserDTO>(model);
        }

        public async Task<UserDTO> UpdateAsync(int id, UserDTO user)
        {
            var model = _mapper.Map<User>(user);
            var updated = _repository.Users.UpdateAsync(model);
            await _repository.SaveAsync();
            return _mapper.Map<UserDTO>(updated);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            User itemToDelete = await _repository.Users.GetByIdAsync(id);
            _repository.Users.DeleteAsync(itemToDelete);
            await _repository.SaveAsync();
            return true;
        }

        public async Task<List<FileDTO>> GetUserFilesByUserIdAsync(int userId)
        {
            var files = await _repository.Files.GetFilesByUserIdAsync(userId);
            return _mapper.Map<List<FileDTO>>(files);
        }
    }
}
