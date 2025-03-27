using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace IntelliDocs.Data.Repositories
{
    public class FileRepository : Repository<UserFile>, IFileRepository
    {
        public FileRepository(DataContext context) : base(context) { }

        public async Task<UserFile?> GetFileByKeyAsync(string key)
        {
            return await _dbSet.FirstOrDefaultAsync(f => f.FileKey == key);
        }

        public async Task<IEnumerable<UserFile>> GetFilesByUserIdAsync(int userId)
        {
            return await _dbSet.Where(file => file.AuthorId == userId).ToListAsync();
        }

        public async Task<UserFile?> GetFileByFileNameAsync(string fileName)
        {
            return await _dbSet.FirstOrDefaultAsync(f => f.FileName == fileName);
        }

        public async Task<bool> ExistsByFileNameAsync(string fileName)
        {
            return await _dbSet.AnyAsync(f => f.FileName == fileName);
        }
        public async Task<long> SumFileSizeAsync()
        {
            return await _dbSet.SumAsync(f => f.FileSize);
        }
        public async Task<UserFile> ToggleStar(int id, UserFile updatedFile)
        {
            var file = await _dbSet.FindAsync(id);
            if (file == null)
            {
                throw new Exception("File not found.");
            }

            file.IsStarred = updatedFile.IsStarred;

            _dbSet.Update(file);
            return file;
        }
    }
}