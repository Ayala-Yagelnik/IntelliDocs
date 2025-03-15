using IntelliDocs.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.IRepositories
{
   public interface IPermissionRepository:IRepository<Permission>
    {
        Task<List<Permission>> GetFull();

    }
}
