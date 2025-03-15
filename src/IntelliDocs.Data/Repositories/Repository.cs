using IntelliDocs.Core.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace IntelliDocs.Data.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly DbSet<T> _dbSet;

        public Repository(DataContext context)
        {
            _dbSet = context.Set<T>();
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null)
            {
                return false;
            }

            _dbSet.Remove(entity);
            return true;
        }

        public async Task<T> UpdateAsync(int id, T entity)
        {
            var existingEntity = await _dbSet.FindAsync(id);
            if (existingEntity == null)
            {
                return null;
            }

            _dbSet.Entry(existingEntity).CurrentValues.SetValues(entity);
            return existingEntity;
        }
    }
}