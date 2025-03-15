using AutoMapper;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using IntelliDocs.Core.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Service.services
{
    class RoleService:IRoleService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;

        public RoleService(IRepositoryManager iRepository, IMapper mapper)
        {
            _repository = iRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<RoleDTO>> GetAllRoles()
        {
            var roles = await _repository.roles.GetFull();
            return _mapper.Map<IEnumerable<RoleDTO>>(roles);
        }

        public async Task<RoleDTO> GetRoleById(int id)
        {
            var role = await _repository.roles.GetByIdAsync(id);
            return _mapper.Map<RoleDTO>(role);
        }

        public async Task<RoleDTO> AddRole(RoleDTO roleDto)
        {
            var roleEntity = _mapper.Map<Role>(roleDto);
            roleEntity = await _repository.roles.AddAsync(roleEntity);
            if (roleEntity != null)
            {
                await _repository.SaveAsync();
                return _mapper.Map<RoleDTO>(roleEntity);
            }
            return null;
        }

        public async Task<RoleDTO> UpdateRole(int id, RoleDTO roleDto)
        {
            var roleEntity = _mapper.Map<Role>(roleDto);
            roleEntity = await _repository.roles.UpdateAsync(id, roleEntity);
            if (roleEntity != null)
            {
                await _repository.SaveAsync();
                return _mapper.Map<RoleDTO>(roleEntity);
            }
            return null;
        }

        public async Task<bool> DeleteRole(int id)
        {
            bool succeed = await _repository.roles.DeleteAsync(id);
            if (succeed)
                await _repository.SaveAsync();
            return succeed;
        }
    }
}
