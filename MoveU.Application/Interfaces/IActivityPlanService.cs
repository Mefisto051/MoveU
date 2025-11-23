using MoveU.Application.DTOs;

namespace MoveU.Application.Interfaces
{
    public interface IActivityPlanService
    {
        Task<ActivityPlanDto> CreatePlanAsync(int userId, ActivityPlanDto dto);
        Task<IEnumerable<ActivityPlanDto>> GetPlansByUserAsync(int userId);
        Task<ActivityPlanDto> UpdatePlanAsync(int planId, int userId, ActivityPlanDto dto); // ✅ NUEVO
        Task<bool> DeletePlanAsync(int planId, int userId); // ✅ NUEVO
    }
}
