using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;
using AutoMapper;

namespace IntelliDocs.Core
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<UserDTO, User>()
                           .ForMember(dest => dest.Role, opt => opt.Ignore());
            CreateMap<UserFile, FileDTO>().ReverseMap();
            CreateMap<PermissionDTO, Permission>().ReverseMap();
            CreateMap<RoleDTO, Role>().ReverseMap();
        }
    }
}