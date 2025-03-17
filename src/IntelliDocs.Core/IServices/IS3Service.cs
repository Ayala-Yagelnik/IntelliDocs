using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



    namespace IntelliDocs.Core.IServices
    {
        public interface IS3Service
        {
            Task<string> GeneratePresignedUrlAsync(string fileName, string contentType);
            Task<string> GetDownloadUrlAsync(string fileName);
        }
    }
