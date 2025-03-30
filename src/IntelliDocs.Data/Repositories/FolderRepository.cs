using IntelliDocs.Core.Entities;
using IntelliDocs.Core.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Data.Repositories
{
   public class FolderRepository:Repository<Folder>,IFolderRepository
    {
        public FolderRepository(DataContext context) : base(context){}

        public async Task<List<Folder>> GetAllAsync()
        {
            return await _dbSet
                .Include(f => f.SubFolders)
                .Include(f => f.Files)
                .ToListAsync();
        }

        public async Task<Folder> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(f => f.SubFolders)
                .Include(f => f.Files)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<Folder> AddAsync(Folder folder)
        {
            _dbSet.Add(folder);
            return folder;
        }

        public async Task<Folder> UpdateAsync(int id, Folder folder)
        {
            var existingFolder = await _dbSet.FindAsync(id);
            if (existingFolder == null)
            {
                throw new InvalidOperationException("Folder not found.");
            }

            existingFolder.Name = folder.Name;
            existingFolder.ParentFolderId = folder.ParentFolderId;
            existingFolder.OwnerId = folder.OwnerId;

            _dbSet.Update(existingFolder);
            return existingFolder;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var folder = await _dbSet.FindAsync(id);
            if (folder == null) return false;

            _dbSet.Remove(folder);
            return true;
        }
    }
}
