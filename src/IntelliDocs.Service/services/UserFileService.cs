using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using IntelliDocs.Core.IServices;

using AutoMapper;


namespace IntelliDocs.Service.Services
{
    public class UserFileService : IUserFileService
    {
        private readonly IRepositoryManager _repository;
        private readonly IMapper _mapper;
        public UserFileService(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task UploadFileAsync(UserFile file)
        {
            await _repository.Files.AddAsync(file);
            await _repository.SaveAsync();
        }

        public async Task ShareFileAsync(int fileId, int userId)
        {
            var file = _repository.Files.GetByIdAsync(fileId);
            if (file is null)
            {
                throw new Exception("File not found");
            }
            await _repository.SaveAsync();
        }

        public async Task<IEnumerable<UserFile>> SearchFilesAsync(string query, int userId)
        {
            var files = await _repository.Files.GetListAsync();
            var userFiles = files.Where(f => f.Id == userId && f.FileName.Contains(query));
            return userFiles;
        }

        public async Task<bool> DeleteFileAsync(int fileId)
        {
            UserFile? itemToDelete = await _repository.Files.GetByIdAsync(fileId);
            if (itemToDelete == null)
            {
                return false;
            }
            _repository.Files.DeleteAsync(itemToDelete);
            await _repository.SaveAsync();
            return true;
        }
    }
}
