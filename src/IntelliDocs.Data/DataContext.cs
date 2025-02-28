using IntelliDocs.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Data
{
    class DataContext:DbContext
    {
        public DbSet<User>? Users { get; set; }
    }
}
