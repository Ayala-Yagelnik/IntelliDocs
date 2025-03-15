using AutoMapper;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using IntelliDocs.Core.IServices;
using IntelliDocs.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Service.services
{
    class PermissionService : IPermissionService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;

        public PermissionService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<PermissionDTO> AddPermission(PermissionDTO permission)
        {
            var permissionEntity = _mapper.Map<Permission>(permission);
            var newPermission = await _repository.permissions.AddAsync(permissionEntity);
            if (newPermission == null)
            {
                throw null;
            }
            await _repository.SaveAsync();
            return _mapper.Map<PermissionDTO>(newPermission);
        }

        public async Task<bool> DeletePermission(int id)
        {
            bool success = await _repository.permissions.DeleteAsync(id);
            if (success)
            {
                await _repository.SaveAsync();
            }
            return success;
        }

        public async Task<IEnumerable<PermissionDTO>> GetAllPermissions()
        {
            var permissions = await _repository.permissions.GetAllAsync();
            return _mapper.Map<IEnumerable<PermissionDTO>>(permissions);
        }

        public async Task<PermissionDTO> GetPermissionById(int id)
        {
            var permission = _repository.permissions.GetByIdAsync(id);
            return _mapper.Map<PermissionDTO>(permission);
        }

        public async Task<PermissionDTO> UpdatePermission(int id, PermissionDTO permission)
        {
            var permissionEntity = _mapper.Map<Permission>(permission);
            var updatedPermission = _repository.permissions.UpdateAsync(id, permissionEntity);
            if (updatedPermission == null)
            {
                return null;
            }
            await _repository.SaveAsync();
            return _mapper.Map<PermissionDTO>(updatedPermission);
        }
    }
}
