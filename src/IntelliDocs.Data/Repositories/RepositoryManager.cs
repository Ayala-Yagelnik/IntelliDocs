using IntelliDocs.Core.IRepositories;

namespace IntelliDocs.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly DataContext _context;
        public IFileRepository Files { get; }

        public IUserRepository Users { get; }

        public RepositoryManager(DataContext context, IFileRepository files, IUserRepository users)
        {
            _context = context;
            Files = files;
            Users = users;
        }
        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }

    }

}