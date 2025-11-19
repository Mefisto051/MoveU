using MoveU.Domain.Entities;
using MoveU.Domain.Interfaces;
using MoveU.Infrastructure.Data;
using MoveU.Infrastructure.Repositories;

namespace MoveU.Infrastructure.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MoveUDbContext _context;

        public IUserRepository Users { get; }  // Cambiado aquí
        public IGenericRepository<ActivityPlan> ActivityPlans { get; }
        public IGenericRepository<RefreshToken> RefreshTokens { get; }

        public UnitOfWork(MoveUDbContext context)
        {
            _context = context;
            Users = new UserRepository(context);
            ActivityPlans = new GenericRepository<ActivityPlan>(context);
            RefreshTokens = new GenericRepository<RefreshToken>(context);
        }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
