using IntelliDocs.Core.Entities;

namespace IntelliDocs.Core.DTOs
{
    public class FileDTO
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileKey { get; set; } = string.Empty;
        public DateTime? UploadDate { get; set; }
        public long FileSize { get; set; }
        public string FileType { get; set; } = string.Empty;
        public int AuthorId { get; set; }
        public bool IsStarred { get; set; }
        public AuthorDTO? Author { get; set; }

    }
    public class AuthorDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }
}