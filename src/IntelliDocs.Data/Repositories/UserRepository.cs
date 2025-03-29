using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using Microsoft.EntityFrameworkCore;


namespace IntelliDocs.Data.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(DataContext context) : base(context) { }
        public new async Task<List<User>> GetAllAsync()
        {
            return await _dbSet.Include(u => u.CreatedFiles).ToListAsync();
        }
        public async Task<User> GetUserByEmailAsync(string email)
        {
            var user = await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }
            return user;
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _dbSet.AnyAsync(u => u.Email == email);
        }
        public new async Task<bool> DeleteAsync(int id)
        {
            var existingEntity = await _dbSet.FindAsync(id);
            if (existingEntity == null)
            {
                return false;
            }
            var entity = existingEntity as User;
            entity.AccountStatus = "Deleted";
            _dbSet.Entry(existingEntity).CurrentValues.SetValues(entity);
            return true;

        }

        public async Task<bool> ReactivateAsync(int id)
        {
            var existingEntity = await _dbSet.FindAsync(id);
            if (existingEntity == null)
            {
                return false;
            }
            var entity = existingEntity;
            entity.AccountStatus = "Active";
            // _dbSet.Entry(existingEntity).CurrentValues.SetValues(entity);
            _dbSet.Update(entity);
            return true;
        }
        public async Task<IEnumerable<UserFile>> GetSharedFilesAsync(int userId)
        {
            var user = await _dbSet.Include(u => u.SharedFiles).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new Exception($"User with ID {userId} not found.");
            }

            return user.SharedFiles;
        }
        public async Task<List<UserStorageDto>> GetUserStorageUsageAsync()
        {
            return await _dbSet.Select(user => new UserStorageDto
            {
                Username = user.Username,
                Email = user.Email,
                StorageUsed = user.CreatedFiles.Sum(f => f.FileSize)
            }).ToListAsync();
        }
    }

}
