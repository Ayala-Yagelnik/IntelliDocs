using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.Entities
{
    [Table("User")]
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime LastLogin { get; set; } = DateTime.Now;
        public string AccountStatus { get; set; } = "Active";
        public string? GoogleId { get; set; }
        public int RoleId { get; set; }
        [ForeignKey("RoleId")]
        public required Role Role { get; set; }
        public List<UserFile> CreatedFiles { get; set; } = new();
        public List<UserFile> SharedFiles { get; set; } = new();

    }
}