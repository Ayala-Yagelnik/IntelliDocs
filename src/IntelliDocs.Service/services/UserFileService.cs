using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using IntelliDocs.Core.IServices;

using AutoMapper;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Data.Repositories;


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

        public async Task<FileDTO> UploadFileAsync(FileDTO fileDto)
        {
            var file = _mapper.Map<UserFile>(fileDto);
            var f = await _repository.Files.AddAsync(file);
            if (f == null)
            {
                throw null;
            }
            await _repository.SaveAsync();
            return _mapper.Map<FileDTO>(f);
        }

        //TODO: Implement the method
        public async Task<FileDTO> ShareFileAsync(int fileId, int userId)
        {
            var file = _repository.Files.GetByIdAsync(fileId);
            if (file is null)
            {
                throw new Exception("File not found");
            }
            await _repository.SaveAsync();
            return _mapper.Map<FileDTO>(file);
        }

        public async Task<IEnumerable<UserFile>> SearchFilesAsync(string query, int userId)
        {
            var files = await _repository.Files.GetAllAsync();
            var userFiles = files.Where(f => f.Id == userId && f.FileName.Contains(query));
            return userFiles;
        }

        public async Task<bool> DeleteFileAsync(int fileId)
        {
            bool success = await _repository.Files.DeleteAsync(fileId);
            if (success)
            {
                await _repository.SaveAsync();
            }
            return success;
        }

        public async Task<IEnumerable<FileDTO>> GetAllFiles()
        {
            var files = await _repository.Files.GetAllAsync();
            return _mapper.Map<IEnumerable<FileDTO>>(files);
        }

        public async Task<FileDTO> GetFileById(int id)
        {
            var file = await _repository.Files.GetByIdAsync(id);
            return _mapper.Map<FileDTO>(file);
        }

   
    }
}
