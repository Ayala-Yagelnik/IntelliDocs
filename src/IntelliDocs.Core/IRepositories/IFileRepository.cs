using IntelliDocs.Core.Entities;

namespace IntelliDocs.Core.IRepositories
{
    public interface IFileRepository:IRepository<UserFile>
    {
        Task<IEnumerable<UserFile>> GetFilesByUserIdAsync(int userId);
        Task<UserFile> GetFileByFileNameAsync(string fileName);
        Task<bool> ExistsByFileNameAsync(string fileName);
    }
}