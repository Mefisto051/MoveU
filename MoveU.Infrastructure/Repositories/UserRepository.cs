using Microsoft.EntityFrameworkCore;
using MoveU.Domain.Entities;
using MoveU.Domain.Interfaces;
using MoveU.Infrastructure.Data;

namespace MoveU.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly MoveUDbContext _context;
        public UserRepository(MoveUDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
        {
            return await _context.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u =>
                    u.RefreshTokens.Any(rt => rt.Token == refreshToken && !rt.IsRevoked));
        }
    }
}
