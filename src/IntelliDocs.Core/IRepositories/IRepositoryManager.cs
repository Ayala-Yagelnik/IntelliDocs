namespace IntelliDocs.Core.IRepositories{
     public interface IRepositoryManager
  {
      public IFileRepository Files { get; }
      public IUserRepository Users { get; }
        IPermissionRepository Permissions { get; }
        IRoleRepository Roles { get; }

        Task SaveAsync();
  }
}