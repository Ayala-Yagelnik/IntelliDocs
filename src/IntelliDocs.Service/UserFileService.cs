using IntelliDocs.Core.Entities;
using IntelliDocs.Core.Services;
using IntelliDocs.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Service
{
    class UserFileService:IUserFileService
    {
        private readonly DataContext _context;

        public UserFileService(DataContext context)
        {
            _context = context;
        }
        public async Task UploadFileAsync(UserFile file)
        {
            _context.Files.Add(file);
            await _context.SaveChangesAsync();
        }

        public async Task ShareFileAsync(int fileId, int userId)
        {
            var file = _context.Files.FirstOrDefault(x => x.Id == fileId);
            if (file is null)
            {
                throw new Exception("File not found");
            }
            file.SharedWith.Add(new UserFile { UserId = userId });
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<UserFile>> SearchFilesAsync(string query, int userId)
        {
            return await _context.Files.Where(x => x.UserId == userId && x.FileName.Contains(query)).ToListAsync();
        }
    }
}
