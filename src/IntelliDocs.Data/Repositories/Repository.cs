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
        public async Task<List<T>> GetListAsync()
        {
            return await _dbSet.ToListAsync();
        }
        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);

            return entity;
        }
        public void DeleteAsync(T entity)
        {

            _dbSet.Remove(entity);

        }

        public T UpdateAsync(T entity)
        {
            _dbSet.Update(entity);

            return entity;
        }


    }
}