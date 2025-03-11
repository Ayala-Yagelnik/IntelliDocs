using IntelliDocs.Core.Entities;
using IntelliDocs.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Data.Repositories
{
   public class UserRepository:IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public List<User> GetAll()
        {
            return _context.Users.ToList();
        }

        public User? GetById(int id)
        {
            return _context.Users.FirstOrDefault(x => x.Id == id);
        }

        public User Add(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        public User Update(User user)
        {
            var existingUser = GetById(user.Id);
            if (existingUser is null)
            {
                throw new Exception("User not found");
            }
            existingUser.Username = user.Username;
            existingUser.Email = user.Email;
            _context.SaveChanges();
            return existingUser;
        }

        public void Delete(int id)
        {
            var existingUser = GetById(id);
            if (existingUser is not null)
            {
                _context.Users.Remove(existingUser);
                _context.SaveChanges();
            }
        }
    }
}
