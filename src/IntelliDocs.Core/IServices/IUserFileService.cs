using IntelliDocs.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.IServices
{
   public interface IUserFileService
    {
        Task UploadFileAsync(UserFile file);
        Task ShareFileAsync(int fileId, int userId);
        Task<IEnumerable<UserFile>> SearchFilesAsync(string query, int userId);
    }
}
