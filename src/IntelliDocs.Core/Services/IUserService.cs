using IntelliDocs.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.Services
{
   public interface IUserService
    {
        IEnumerable<User> GetAllUsers();

        User? GetById(int id);

        User Add(User user);

        User Update(User user);

        void Delete(int id);
    }
}
