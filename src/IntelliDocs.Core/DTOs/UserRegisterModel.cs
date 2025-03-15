namespace IntelliDocs.Core.DTOs
{
    public class UserRegisterModel
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string Role { get; set; }
    }
}