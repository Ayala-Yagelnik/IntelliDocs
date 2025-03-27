using IntelliDocs.Core.IRepositories;

namespace IntelliDocs.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly DataContext _context;
        public IFileRepository Files { get; }

        public IUserRepository Users { get; }

        public IRoleRepository Roles {  get; }

        public RepositoryManager(DataContext context, IFileRepository files, IUserRepository users, IRoleRepository roles)
        {
            _context = context;
            Files = files;
            Users = users;
            Roles = roles;
        }
        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

    }

}