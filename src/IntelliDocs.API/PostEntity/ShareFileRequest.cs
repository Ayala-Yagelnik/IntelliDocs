namespace IntelliDocs.API.PostEntity
{
    public class ShareFileRequest
    {
        public int FileId { get; set; }
        public string Email { get; set; }=string.Empty;
    }
}