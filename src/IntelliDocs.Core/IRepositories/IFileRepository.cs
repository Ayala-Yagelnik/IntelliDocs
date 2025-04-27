using IntelliDocs.Core.Entities;

namespace IntelliDocs.Core.IRepositories
{
    public interface IFileRepository : IRepository<UserFile>
    {
        Task<IEnumerable<UserFile>> GetFilesByUserIdAsync(int userId, bool includeDeleted=false);
        Task<UserFile> GetFileByFileNameAsync(string fileName);
        Task<bool> ExistsByFileNameAsync(string fileName);
        Task<long> SumFileSizeAsync();
        Task<UserFile> ToggleStar(int id, UserFile updatedFile);
    }
}