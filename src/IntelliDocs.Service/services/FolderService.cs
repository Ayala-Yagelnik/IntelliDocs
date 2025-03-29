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

        public async Task<IEnumerable<Folder>> GetSubFoldersAsync(int parentId)
        {
            var allFolders = await _repository.Folders.GetAllAsync();
            return allFolders.Where(f => f.ParentFolderId == parentId).ToList();
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
    }
}
