﻿using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using IntelliDocs.Core.IServices;

using AutoMapper;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Data.Repositories;
using System.Net.Http.Json;


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

        public async Task<IEnumerable<FileDTO>> GetFilesByUserIdAsync(int userId)
        {
            var userFiles = await _repository.Files.GetFilesByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<FileDTO>>(userFiles);
        }


public async Task<IEnumerable<FileDTO>> GetSharedFilesAsync(int userId)
{
    var sharedFiles = await _repository.Users.GetSharedFilesAsync(userId);
    return sharedFiles.Select(file => new FileDTO
    {
        Id = file.Id,
        FileName = file.FileName,
        FileKey = file.FileKey,
        FileSize = file.FileSize,
        FileType = file.FileType,
        AuthorId = file.AuthorId,
    });
}
        public async Task<FileDTO> UploadFileAsync(FileDTO fileDto)
        {
            Console.WriteLine($"FileDTO: {System.Text.Json.JsonSerializer.Serialize(fileDto)}");
            if (fileDto.AuthorId <= 0)
                throw new ArgumentException("Invalid AuthorId.");

            var file = _mapper.Map<UserFile>(fileDto);
            file.UploadDate = DateTime.UtcNow;
            // Ensure the Author exists in the database
            var authorExists = await _repository.Users.GetByIdAsync(fileDto.AuthorId);
            if (authorExists == null)
                throw new Exception("Author not found.");
            authorExists.CreatedFiles.Add(file);
            var savedFile = await _repository.Files.AddAsync(file);
            await _repository.Users.UpdateAsync(fileDto.AuthorId, authorExists);
            if (savedFile == null)
            {
                throw new Exception("Failed to save file metadata.");
            }

            await _repository.SaveAsync();
            return _mapper.Map<FileDTO>(savedFile);
        }

        //TODO: Implement the method
        public async Task<FileDTO> ShareFileAsync(int fileId, string email)
        {
            Console.WriteLine($"Attempting to share file with ID: {fileId} for user ID: {email}");

            if (fileId <= 0)
            {
                throw new Exception("Invalid fileId ");
            }
            var user = await _repository.Users.GetUserByEmailAsync(email);
            var file = await _repository.Files.GetByIdAsync(fileId);
            if (file == null)
            {
                Console.WriteLine($"File with ID {fileId} not found.");
                throw new Exception("File not found");
            }

            if (user == null)
            {
                Console.WriteLine($"User with ID {email} not found.");
                throw new Exception("User not found");
            }
            // הוסף את המשתמש לרשימת המשתמשים ששיתפו את הקובץ
            file.SharedUsers.Add(user);
            user.SharedFiles.Add(file);

            // שמור את השינויים במסד הנתונים
            await _repository.SaveAsync();

            Console.WriteLine($"File with ID {fileId} successfully shared with user ID {email}.");

            // החזר את הקובץ כ-FileDTO
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

        public async Task<double> GetTotalStorageUsedAsync()
        {
            // Assuming you have a `FileSize` property in bytes in your file entity
            var totalBytes = await _repository.Files.SumFileSizeAsync();
            return totalBytes / (1024.0 * 1024.0 * 1024.0);
        }

        public async Task<bool> ToggleStarFileAsync(int fileId, bool isStarred)
        {
            var file = await _repository.Files.GetByIdAsync(fileId);
            if (file == null)
            {
                throw new Exception("File not found.");
            }
            file.IsStarred = isStarred;
            await _repository.Files.ToggleStar(fileId, file);
            await _repository.SaveAsync();

            return true;
        }
    }
}
