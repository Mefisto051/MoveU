using MoveU.Application.DTOs;

namespace MoveU.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> GetUserProfileAsync(int id);
        Task<UserDto> CreateUserAsync(UserRegisterDto dto);
    }
}
