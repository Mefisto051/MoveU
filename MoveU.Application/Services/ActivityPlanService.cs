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
            
            entity.Date = entity.Date.Kind == DateTimeKind.Unspecified 
                ? DateTime.SpecifyKind(entity.Date, DateTimeKind.Utc)
                : entity.Date.ToUniversalTime();
                
            entity.CreatedAt = DateTime.UtcNow;

            await _uow.ActivityPlans.AddAsync(entity);
            await _uow.SaveAsync();

            return entity.ToDto();
        }

        public async Task<IEnumerable<ActivityPlanDto>> GetPlansByUserAsync(int userId)
        {
            var plans = await _uow.ActivityPlans.FindAsync(p => p.UserId == userId);
            return plans.Select(p => p.ToDto());
        }

        // ✅ NUEVO MÉTODO - ACTUALIZAR PLAN
        public async Task<ActivityPlanDto> UpdatePlanAsync(int planId, int userId, ActivityPlanDto dto)
        {
            var plan = await _uow.ActivityPlans.GetByIdAsync(planId);
            
            if (plan == null)
                throw new Exception("Plan no encontrado");
            
            if (plan.UserId != userId)
                throw new Exception("No tienes permisos para editar este plan");

            // Actualizar campos
            plan.Title = dto.Title;
            plan.Description = dto.Description;
            plan.DurationMinutes = dto.DurationMinutes;
            plan.Difficulty = dto.Difficulty;
            plan.Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc);

            await _uow.SaveAsync();
            return plan.ToDto();
        }

        // ✅ NUEVO MÉTODO - ELIMINAR PLAN
        public async Task<bool> DeletePlanAsync(int planId, int userId)
        {
            var plan = await _uow.ActivityPlans.GetByIdAsync(planId);
            
            if (plan == null)
                throw new Exception("Plan no encontrado");
            
            if (plan.UserId != userId)
                throw new Exception("No tienes permisos para eliminar este plan");

            _uow.ActivityPlans.Remove(plan);
            await _uow.SaveAsync();
            
            return true;
        }
    }
}
