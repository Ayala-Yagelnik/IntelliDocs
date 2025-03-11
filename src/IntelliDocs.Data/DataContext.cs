﻿using IntelliDocs.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Data
{
   public class DataContext : DbContext, IDataContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<UserFile> Files { get; set; }
        public DbSet<SharedFile> SharedFiles { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
    }
}