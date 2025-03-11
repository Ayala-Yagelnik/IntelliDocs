using IntelliDocs.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.Repositories
{
   public interface IUserRepository
    {
        List<User> GetAll();

        User? GetById(int id);

        User Add(User user);

        User Update(User user);

        void Delete(int id);
    }
}
