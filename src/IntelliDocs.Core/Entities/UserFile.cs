using IntelliDocs.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.Entities
{
    [Table("Files")]
    public class UserFile
    {
        [Key]
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileKey { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string FileType { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; }
        public int AuthorId { get; set; }
        [ForeignKey("AuthorId")]
        public required User Author { get; set; }

        public int? FolderId { get; set; }
        [ForeignKey("FolderId")]
        public Folder? Folder { get; set; }

        public List<User> SharedUsers { get; set; } = new();

        public bool IsStarred { get; set; }
    }
}
