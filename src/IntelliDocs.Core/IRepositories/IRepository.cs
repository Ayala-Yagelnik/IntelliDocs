using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.IRepositories
{
    public interface IRepository<T>
    {
        public Task<List<T>> GetAllAsync();

        public Task<T> GetByIdAsync(int id);

        public Task<T> AddAsync(T val);

        public Task<T> UpdateAsync(int id, T val);

        public Task<bool> DeleteAsync(int id);
    }
}
