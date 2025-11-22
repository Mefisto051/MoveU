using MoveU.Domain.Entities;

namespace MoveU.Domain.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User> GetByEmailAsync(string email);
        Task<User> GetByRefreshTokenAsync(string refreshToken);
    }
}
