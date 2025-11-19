using MoveU.Application.DTOs;
using MoveU.Application.Interfaces;
using MoveU.Application.Mappings;
using MoveU.Domain.Interfaces;

namespace MoveU.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _uow;
        public UserService(IUnitOfWork uow) { _uow = uow; }

        public async Task<UserDto> CreateUserAsync(UserRegisterDto dto)
        {
            var entity = dto.ToEntity();
            // hash password here (simple example, replace with real hash)
            entity.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            await _uow.Users.AddAsync(entity);
            await _uow.SaveAsync();
            return entity.ToDto();
        }

        public async Task<UserDto> GetUserProfileAsync(int id)
        {
            var u = await _uow.Users.GetByIdAsync(id);
            return u == null ? null : u.ToDto();
        }
    }
}
