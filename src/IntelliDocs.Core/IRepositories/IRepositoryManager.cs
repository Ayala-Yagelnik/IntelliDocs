namespace IntelliDocs.Core.IRepositories{
     public interface IRepositoryManager
  {
      public IFileRepository Files { get; }
      public IUserRepository Users { get; }
       public IRoleRepository Roles { get; }

      public  Task SaveAsync();
  }
}