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
      public DbSet<Folder> Folders { get; set; }

      protected override void OnModelCreating(ModelBuilder modelBuilder)
      {
         base.OnModelCreating(modelBuilder);


         modelBuilder.Entity<UserFile>()
     .HasOne(f => f.Author)
     .WithMany(u => u.CreatedFiles)
     .HasForeignKey(f => f.AuthorId)
     .OnDelete(DeleteBehavior.Restrict);

         modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

         modelBuilder.Entity<User>()
         .HasMany(u => u.SharedFiles)
         .WithMany(f => f.SharedUsers)
         .UsingEntity<Dictionary<string, object>>(
             "UserFileShare",
             j => j.HasOne<UserFile>().WithMany().HasForeignKey("FileId"),
             j => j.HasOne<User>().WithMany().HasForeignKey("UserId"));


      }
   }
}