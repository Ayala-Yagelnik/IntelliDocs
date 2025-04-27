using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.Entities
{
    public class Folder
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? ParentFolderId { get; set; }
        [ForeignKey("ParentFolderId")]
        public Folder? ParentFolder { get; set; }
        public int OwnerId { get; set; }
        [ForeignKey("OwnerId")]
        public User Owner { get; set; } = null!;
        public ICollection<Folder> SubFolders { get; set; } = new List<Folder>();
        public ICollection<UserFile> Files { get; set; } = new List<UserFile>();

        public bool IsStarred { get; set; }
        public bool IsDeletted { get; set; }
    }
}
