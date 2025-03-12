using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.IRepositories
{
    public interface IRepository<T>
    {
        public Task<List<T>> GetListAsync();

        public Task<T> GetByIdAsync(int id);

        public Task< T >AddAsync(T val);

        public T UpdateAsync(T val);

        public void DeleteAsync(T id);
    }
}
