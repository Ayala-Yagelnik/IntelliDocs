using IntelliDocs.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core.Entities
{
   public class SharedFile
    {
        public int Id { get; set; }
        public int FileId { get; set; }
        public UserFile File { get; set; }
        public int SharedWithUserId { get; set; }
        public User SharedWithUser { get; set; }
    }
       
}
