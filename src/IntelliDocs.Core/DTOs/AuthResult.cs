namespace IntelliDocs.Core.DTOs
{
    public class AuthResult
    {
        public UserDTO User { get; set; }
        public bool Succeeded { get; set; }
        public List<string>? Errors { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}