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
        public string Username { get; set; }=string.Empty;
        [Required]
        public string PasswordHash { get; set; }=string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; }=string.Empty;
        public bool IsAdmin { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public string AccountStatus { get; set; } = "Active";
        public List<UserFile>? UserFiles { get; set; }

    }
}
