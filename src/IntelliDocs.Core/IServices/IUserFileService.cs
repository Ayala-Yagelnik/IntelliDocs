using IntelliDocs.Core.DTOs;
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


        public Task<IEnumerable<FileDTO>> GetFilesByUserIdAsync(int userId,bool includeDeleted);
        public Task<IEnumerable<FileDTO>> GetAllFiles();
        public Task<FileDTO> GetFileById(int id);
        public Task<IEnumerable<FileDTO>> GetSharedFilesAsync(int userId);
        public Task<IEnumerable<FileDTO>> GetFilesInFolderAsync(int? folderId, int userId,bool includeDeleted);
        public Task<IEnumerable<FileDTO>> SearchFilesByEmbeddingAsync(float[] embedding, int userId);
        public Task<FileDTO> UploadFileAsync(FileDTO file);
        public Task<FileDTO> ShareFileAsync(int fileId, string email);
        public Task<IEnumerable<UserFile>> SearchFilesAsync(string query, int userId);
        public Task<bool> DeleteFileAsync(int fileId);
        public Task<double> GetTotalStorageUsedAsync();
        public Task<bool> ToggleStarFileAsync(int fileId, bool isStarred);
        public Task<IEnumerable<FileDTO>> GetTrashFilesAsync(int userId);
        public  Task<bool> MoveFileToTrashAsync(int fileId);
        public Task<bool> PermanentlyDeleteFileAsync(int fileId);
        public  Task<bool> RestoreFileAsync(int fileId);

    }
}
