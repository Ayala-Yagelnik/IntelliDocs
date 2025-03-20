using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using Microsoft.EntityFrameworkCore;


namespace IntelliDocs.Data.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(DataContext context) : base(context) { }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _dbSet.AnyAsync(u => u.Email == email);
        }
        public async Task<bool> DeleteAsync(int id)
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

        public async Task<List<UserStorageUsageDto>> GetUserStorageUsageAsync()
        {
            return await _dbSet.Select(user => new UserStorageUsageDto
            {
                Username = user.Username,
                Email = user.Email,
                StorageUsed = user.UserFiles.Sum(f => f.FileSize)
            }).ToListAsync();
        }
    }

}
