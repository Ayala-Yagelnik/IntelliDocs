using DotNetEnv;
using IntelliDocs.Core.IServices;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System.Threading.Tasks;


public class EmailService : IEmailService
{
  private readonly IConfiguration _config;
  public EmailService(IConfiguration config)
  {
    _config = config;
  }

  public async Task SendEmailAsync(string to, string subject, string body)
  {
    var email = new MimeMessage();
    email.From.Add(MailboxAddress.Parse(_config["Email:From"]));
    email.To.Add(MailboxAddress.Parse(to));
    email.Subject = subject;
    email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = body };
    // var appPassword = Environment.GetEnvironmentVariable("GOOGLE_APP_PASSWORD");

    using var smtp = new SmtpClient();
    smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;
    await smtp.ConnectAsync(_config["Email:Smtp"], int.Parse(_config["Email:Port"]), MailKit.Security.SecureSocketOptions.StartTls);
    await smtp.AuthenticateAsync(_config["Email:User"], _config["Email:Password"]);
    await smtp.SendAsync(email);
    await smtp.DisconnectAsync(true);
  }

  public async Task SendFileShareEmailAsync(string to, string senderName, string fileName, DateTime sharedAt, string fileUrl)
  {
    var subject = $"📩{senderName} shared a file with you on IntelliDocs📮";
    var formattedDate = sharedAt.ToString("dd/MM/yyyy HH:mm");
    var body = $@"
      <table width=""600"" align=""center"" cellpadding=""0"" cellspacing=""0"" style=""font-family:Arial,sans-serif;background-color:#f9f9f9;padding:20px;border-radius:8px;"">
        <tr>
          <td align=""center"" style=""padding-bottom:20px;"">
            <img src=""https://intellidocs-client-app.onrender.com/logo.png"" alt=""IntelliDocs Logo"" height=""50"">
          </td>
        </tr>
        <tr>
          <td style=""background-color:#ffffff;padding:30px;border-radius:8px;"">
            <h2 style=""color:#2CC4A0;"">📨{senderName} shared a file with you!</h2>
            <p style=""font-size:16px;color:#333;"">Hi,</p>
            <p style=""font-size:15px;color:#555;"">
              <b>{senderName}</b> has shared the file <b>“{fileName}”</b> with you via IntelliDocs.<br/>
              <b>Date:</b> {formattedDate}
            </p>
            <p style=""text-align:center;margin:30px 0;"">
              <a href=""{fileUrl}"" style=""background-color:#2CC4A0;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:16px;"">
                view file
              </a>
            </p>
            <p style=""font-size:12px;color:#999;"">If you were not expecting this file, you can safely ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td align=""center"" style=""font-size:11px;color:#999;padding-top:20px;"">
            © IntelliDocs | Secure Smart File Management
          </td>
        </tr>
      </table>";

    Console.WriteLine("--------------------------------------------------------------------");
    Console.WriteLine("FROM: " + _config["Email:From"]);
    Console.WriteLine("SMTP: " + _config["Email:Smtp"]);
    Console.WriteLine("PORT: " + _config["Email:Port"]);
    Console.WriteLine("USER: " + _config["Email:User"]);
    Console.WriteLine("TO: " + to); var email = new MimeMessage();
    email.From.Add(MailboxAddress.Parse(Environment.GetEnvironmentVariable("EMAIL_FROM")
    // _config["Email:From"]
    ));
    email.To.Add(MailboxAddress.Parse(to));
    email.Subject = subject;
    email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = body };

    using var smtp = new SmtpClient();
    smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;
    await smtp.ConnectAsync(Environment.GetEnvironmentVariable("EMAIL_SMTP"),int.Parse(Environment.GetEnvironmentVariable("EMAIL_PORT")), MailKit.Security.SecureSocketOptions.StartTls);
      // _config["Email:Smtp"], int.Parse(_config["Email:Port"]), MailKit.Security.SecureSocketOptions.StartTls);
    await smtp.AuthenticateAsync(Environment.GetEnvironmentVariable("EMAIL_USER"), Environment.GetEnvironmentVariable("EMAIL_PASSWORD"));
      // _config["Email:User"], _config["Email:Password"]);
    await smtp.SendAsync(email);
    await smtp.DisconnectAsync(true);
  }

}