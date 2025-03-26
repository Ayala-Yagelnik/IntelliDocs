namespace IntelliDocs.Core.DTOs
{
    public class FileDTO
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string FileType { get; set; } = string.Empty;
        public int AuthorId { get; set; }
        public bool IsStarred { get; set; }
    }
}