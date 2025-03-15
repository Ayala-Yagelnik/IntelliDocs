using IntelliDocs.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.IRepositories
{
  public  interface IRoleRepository: IRepository<Role>
    {
        Task<List<Role>> GetFull();
        Task<Role> GetRoleByName(string name);

    }
}
