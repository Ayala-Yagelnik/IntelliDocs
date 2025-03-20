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
        public DbSet<Permission> Permissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasMany(u => u.UserFiles)
                .WithOne(uf => uf.Author)
                .HasForeignKey(uf => uf.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserFile>()
                .HasOne(uf => uf.Author)
                .WithMany(u => u.UserFiles)
                .HasForeignKey(uf => uf.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}