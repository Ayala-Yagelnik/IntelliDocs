namespace IntelliDocs.Core.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }=string.Empty;
        public string Password { get; set; }=string.Empty;
        public string Email { get; set; }=string.Empty;
        public string AccountStatus { get; set; } = "Active";
    }
}