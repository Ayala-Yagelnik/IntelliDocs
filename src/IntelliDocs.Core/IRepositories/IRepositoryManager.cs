namespace IntelliDocs.Core.IRepositories{
     public interface IRepositoryManager
  {
      public IFileRepository Files { get; }
      public IUserRepository Users { get; }

      Task<int> SaveAsync();
  }
}