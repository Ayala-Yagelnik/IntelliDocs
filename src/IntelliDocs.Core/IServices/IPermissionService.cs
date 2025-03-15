using IntelliDocs.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.IServices
{
 public   interface IPermissionService
    {
        public Task<IEnumerable<PermissionDTO>> GetAllPermissions();
        public Task<PermissionDTO> GetPermissionById(int id);
        public Task<PermissionDTO> AddPermission(PermissionDTO permission);
        public Task<PermissionDTO> UpdatePermission(int id, PermissionDTO permission);
        public Task<bool> DeletePermission(int id);
    }
}
