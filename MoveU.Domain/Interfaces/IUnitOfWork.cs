using MoveU.Domain.Entities;

namespace MoveU.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }  // Cambiado aquí
        IGenericRepository<ActivityPlan> ActivityPlans { get; }
        IGenericRepository<RefreshToken> RefreshTokens { get; }

        Task<int> SaveAsync();
    }
}
