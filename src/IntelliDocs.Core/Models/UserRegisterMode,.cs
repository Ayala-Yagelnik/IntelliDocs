
namespace IntelliDocs.Core.Models
{
    public class UserRegisterModel
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public bool IsAdmin { get; set; }
    }
}