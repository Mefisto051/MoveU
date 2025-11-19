namespace MoveU.Application.DTOs
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public int WeeklyExerciseMinutes { get; set; }
        public int DailyScreenTimeHours { get; set; }
        public bool DoesActiveBreaks { get; set; }
    }
}
