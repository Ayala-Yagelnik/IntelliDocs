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
            CreateMap<User, AuthorDTO>();
            CreateMap<UserFile, FileDTO>()
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author)).ReverseMap();
            CreateMap<RoleDTO, Role>().ReverseMap();
        }
    }
}