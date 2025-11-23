using MoveU.Application.DTOs;

namespace MoveU.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> GetUserProfileAsync(int id);
        Task<UserDto> CreateUserAsync(UserRegisterDto dto);
        Task<UserDto> UpdateUserProfileAsync(int id, UserDto dto);
    }
}
