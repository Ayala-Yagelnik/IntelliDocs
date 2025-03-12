using IntelliDocs.Core.DTOs;
using IntelliDocs.Core.Entities;
using AutoMapper;

namespace IntelliDocs.Core
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<UserFile, FileDTO>().ReverseMap();

        }
    }
}