using IntelliDocs.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Data
{
    public interface IDataContext
    {
        DbSet<User> Users { get; set; }
        DbSet<UserFile> Files { get; set; }
        DbSet<SharedFile> SharedFiles { get; set; }
    }
}
