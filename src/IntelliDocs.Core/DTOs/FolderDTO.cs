using IntelliDocs.Core.Entities;

namespace IntelliDocs.Core.DTOs
{
    public class FolderDTO
    {
        public string Name { get; set; }
        public int? ParentFolderId { get; set; }
        public int OwnerId { get; set; } 
        public DateTime CreatedAt { get; set; }
        public FolderDTO? ParentFolder { get; set; }
        public AuthorDTO? Owner { get; set; } = null!;
        public ICollection<FolderDTO> SubFolders { get; set; } = new List<FolderDTO>();
        public ICollection<FileDTO> Files { get; set; } = new List<FileDTO>();

    }
}