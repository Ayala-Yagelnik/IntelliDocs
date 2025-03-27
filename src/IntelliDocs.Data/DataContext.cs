using IntelliDocs.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<UserFile> Files { get; set; }
        public DbSet<Role> Roles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<UserFile>()
               .HasOne(f => f.Author)
               .WithMany()
               .HasForeignKey(f => f.AuthorId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
               .HasOne(u => u.Role)
               .WithMany(r => r.Users)
               .HasForeignKey(u => u.RoleId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
               .HasMany(u => u.Files)
               .WithMany(f => f.SharedUsers);

            modelBuilder.Entity<UserFile>()
               .Ignore(f => f.Author);
        }
    }
}