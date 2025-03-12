using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using Microsoft.EntityFrameworkCore;


namespace IntelliDocs.Data.Repositories
{
   public class UserRepository:Repository<User>, IUserRepository
    {
        public UserRepository(DataContext context):base(context){}

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _dbSet.AnyAsync(u => u.Email == email);
        }
    }
}
