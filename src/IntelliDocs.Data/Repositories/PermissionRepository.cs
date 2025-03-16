using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Data.Repositories
{
   public class PermissionRepository : Repository<Permission>, IPermissionRepository
    {
        public PermissionRepository(DataContext dataContext) : base(dataContext) { }

        public async Task<List<Permission>> GetFull()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<Permission> GetPermissionByName(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(p => p.NamePermission == name);
        }
    }

}
