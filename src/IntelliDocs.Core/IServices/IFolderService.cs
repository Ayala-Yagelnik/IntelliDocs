using IntelliDocs.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.IServices
{
    public interface IFolderService
    {
        Task<Folder> CreateFolderAsync(Folder folder);
        Task<Folder> GetFolderByIdAsync(int id);
        // Task<IEnumerable<Folder>> GetSubFoldersAsync(int parentId);
        Task<bool> DeleteFolderAsync(int id);
        Task<IEnumerable<UserFile>> GetFilesInFolderAsync(int folderId);
         Task<IEnumerable<Folder>> GetSubFoldersAsync(int? parentFolderId, int userId);

    }
}
