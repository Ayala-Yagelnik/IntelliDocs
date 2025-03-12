namespace IntelliDocs.Core.Models
{
    public class AuthResult
    {
        public bool Succeeded { get; set; }
        public List<string>? Errors { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}