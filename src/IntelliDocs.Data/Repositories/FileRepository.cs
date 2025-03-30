using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace IntelliDocs.Data.Repositories
{
    public class FileRepository : Repository<UserFile>, IFileRepository
    {
        public FileRepository(DataContext context) : base(context) { }
        public new async Task<UserFile?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(f => f.SharedUsers) 
                .FirstOrDefaultAsync(f => f.Id == id);
        }
        public async Task<UserFile?> GetFileByKeyAsync(string key)
        {
            return await _dbSet.FirstOrDefaultAsync(f => f.FileKey == key);
        }

        public async Task<IEnumerable<UserFile>> GetFilesByUserIdAsync(int userId)
        {
            return await _dbSet.Where(file => file.AuthorId == userId).Include(f=>f.Author).ToListAsync();
        }

        public async Task<UserFile> GetFileByFileNameAsync(string fileName)
        {
            var file = await _dbSet.FirstOrDefaultAsync(f => f.FileName == fileName);
            if (file == null)
            {
                throw new Exception("File not found.");
            }
            return file;
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