using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace IntelliDocs.Data.Repositories
{
    public class FileRepository : Repository<UserFile>, IFileRepository
    {
        public FileRepository(DataContext context) : base(context) { }

        public async Task<UserFile?> GetFileByPathAsync(string path)
        {
            return await _dbSet.FirstOrDefaultAsync(f => f.FilePath == path);
        }

        public async Task<bool> ExistsByPathAsync(string path)
        {
            return await _dbSet.AnyAsync(f => f.FilePath == path);
        }

        public async Task<IEnumerable<UserFile>> GetFilesByUserIdAsync(int userId)
        {
            return await _dbSet.Where(file => file.Id == userId).ToListAsync();
        }

        public async Task<UserFile?> GetFileByFileNameAsync(string fileName)
        {
            return await _dbSet.FirstOrDefaultAsync(f=>f.FileName == fileName);
        }

        public async Task<bool> ExistsByFileNameAsync(string fileName)
        {
            return await _dbSet.AnyAsync(f => f.FileName == fileName);
        }
    }
}