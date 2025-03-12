using AutoMapper;
using IntelliDocs.API.PostEntity;
using IntelliDocs.Core.DTOs;

namespace IntelliDocs.API
{
    public class MappingPostEntity : Profile
    {
        public MappingPostEntity()
        {
            CreateMap<UserPost, UserDTO>();
            CreateMap<FilePost, FileDTO>();
        }
    }
}