using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using IntelliDocs.Core.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Service.services
{
    public class FolderService : IFolderService
    {
        private readonly IRepositoryManager _repository;

        public FolderService(IRepositoryManager repository)
        {
            _repository = repository;
        }

        public async Task<Folder> CreateFolderAsync(Folder folder)
        {
            await _repository.Folders.AddAsync(folder);
            await _repository.SaveAsync();
            return folder;
        }

        public async Task<Folder?> GetFolderByIdAsync(int id)
        {
            return await _repository.Folders.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Folder>> GetSubFoldersAsync(int? parentFolderId, int userId, bool IsDeletted = false)
        {
            var allFolders = await _repository.Folders.GetAllAsync();
            return allFolders.Where(f => f.ParentFolderId == parentFolderId && f.OwnerId == userId && f.IsDeletted == IsDeletted).ToList();
        }

        public async Task<bool> DeleteFolderAsync(int id)
        {
            var result = await _repository.Folders.DeleteAsync(id);
            if (result)
            {
                await _repository.SaveAsync();
            }
            return result;
        }

        public async Task<IEnumerable<UserFile>> GetFilesInFolderAsync(int folderId)
        {
            var folder = await _repository.Folders.GetByIdAsync(folderId);
            return folder?.Files ?? Enumerable.Empty<UserFile>();
        }

        public async Task<IEnumerable<Folder>> GetTrashFoldersAsync(int userId)
        {
            var allFolders = await _repository.Folders.GetAllAsync();
            return allFolders.Where(f => f.OwnerId == userId && f.IsDeletted).ToList();
        }

        public async Task<bool> MoveFolderToTrashAsync(int folderId)
        {
            var folder = await _repository.Folders.GetByIdAsync(folderId);
            if (folder == null)
            {
                throw new Exception("Folder not found.");
            }
            folder.IsDeletted = true;
            folder.ParentFolderId = null;
            MarkFolderAndContentsAsDeleted(folder);

            await _repository.Folders.UpdateAsync(folderId, folder);
            await _repository.SaveAsync();
            return true;
        }

        private void MarkFolderAndContentsAsDeleted(Folder folder)
        {
            foreach (var file in folder.Files)
            {
                file.IsDeletted = true;
            }

            foreach (var subFolder in folder.SubFolders)
            {
                subFolder.IsDeletted = true;
                MarkFolderAndContentsAsDeleted(subFolder);
            }
        }

        public async Task<bool> PermanentlyDeleteFolderAsync(int folderId)
        {
            var folder = await _repository.Folders.GetByIdAsync(folderId);
            if (folder == null)
            {
                throw new Exception("Folder not found.");
            }
            await DeleteFolderContentsAsync(folder);
            var result = await _repository.Folders.DeleteAsync(folderId);
            if (result)
            {
                await _repository.SaveAsync();
            }
            return result;
        }
        private async Task DeleteFolderContentsAsync(Folder folder)
        {
            // מחיקת כל הקבצים שבתוך התיקיה
            foreach (var file in folder.Files.ToList())
            {
                await _repository.Files.DeleteAsync(file.Id);
            }

            // מחיקת כל תתי-התקיות
            foreach (var subFolder in folder.SubFolders.ToList())
            {
                await DeleteFolderContentsAsync(subFolder); // קריאה רקורסיבית
                await _repository.Folders.DeleteAsync(subFolder.Id);
            }
        }
    }
}
