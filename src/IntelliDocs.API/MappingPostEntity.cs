using AutoMapper;
using IntelliDocs.API.PostEntity;
using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;

namespace IntelliDocs.API
{
    public class MappingPostEntity : Profile
    {
        public MappingPostEntity()
        {
            CreateMap<UserPost, UserDTO>().ReverseMap();
            CreateMap<FilePost, FileDTO>().ReverseMap();
            CreateMap<RolePost, RoleDTO>().ReverseMap();
            CreateMap<UserDTO, User>()
               .ForMember(dest => dest.Role, opt => opt.Ignore()).ReverseMap();
        }
    }
}