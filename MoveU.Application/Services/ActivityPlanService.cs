using MoveU.Application.DTOs;
using MoveU.Application.Interfaces;
using MoveU.Application.Mappings;
using MoveU.Domain.Entities;
using MoveU.Domain.Interfaces;

namespace MoveU.Application.Services
{
    public class ActivityPlanService : IActivityPlanService
    {
        private readonly IUnitOfWork _uow;

        public ActivityPlanService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task<ActivityPlanDto> CreatePlanAsync(int userId, ActivityPlanDto dto)
        {
            var entity = dto.ToEntity(userId);

            await _uow.ActivityPlans.AddAsync(entity);
            await _uow.SaveAsync();

            return entity.ToDto();
        }

        public async Task<IEnumerable<ActivityPlanDto>> GetPlansByUserAsync(int userId)
        {
            var plans = await _uow.ActivityPlans.FindAsync(p => p.UserId == userId);
            return plans.Select(p => p.ToDto());
        }
    }
}
