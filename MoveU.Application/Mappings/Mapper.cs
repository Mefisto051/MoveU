using MoveU.Application.DTOs;
using MoveU.Domain.Entities;

namespace MoveU.Application.Mappings
{
    public static class Mapper
    {
        public static UserDto ToDto(this User u) => new()
        {
            UserId = u.UserId,
            FullName = u.FullName,
            Age = u.Age,
            Gender = u.Gender,
            Email = u.Email,
            Role = u.Role,
            WeeklyExerciseMinutes = u.WeeklyExerciseMinutes,
            DailyScreenTimeHours = u.DailyScreenTimeHours,
            DoesActiveBreaks = u.DoesActiveBreaks
        };

        public static User ToEntity(this UserRegisterDto dto) => new()
        {
            FullName = dto.FullName,
            Age = dto.Age,
            Gender = dto.Gender,
            Email = dto.Email,
            PasswordHash = dto.Password,
            Role = "Student"
        };

        public static ActivityPlanDto ToDto(this ActivityPlan p)
        {
            return new ActivityPlanDto
            {
                ActivityPlanId = p.ActivityPlanId,
                Title = p.Title,
                Description = p.Description,
                DurationMinutes = p.DurationMinutes,
                Difficulty = p.Difficulty,
                Date = p.Date
            };
        }

        public static ActivityPlan ToEntity(this ActivityPlanDto dto, int userId)
        {
            return new ActivityPlan
            {
                UserId = userId,
                Title = dto.Title,
                Description = dto.Description,
                DurationMinutes = dto.DurationMinutes,
                Difficulty = dto.Difficulty,
                Date = dto.Date,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}
