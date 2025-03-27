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
   public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(DataContext dataContext) : base(dataContext) { }

        public async Task<List<Role>> GetFull()
        {
            return await _dbSet.Include(r => r.Users).ToListAsync();
        }

        public async Task<Role> GetRoleByName(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(r => r.NameRole == name);
        }
    }
}
