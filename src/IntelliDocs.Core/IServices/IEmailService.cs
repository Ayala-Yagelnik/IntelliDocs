using System.Threading.Tasks;

namespace IntelliDocs.Core.IServices
{

    public interface IEmailService
    {

        Task SendEmailAsync(string to, string subject, string body);
    }
}