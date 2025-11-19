namespace MoveU.Application.DTOs
{
    public class ActivityPlanDto
    {
        public int ActivityPlanId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public int DurationMinutes { get; set; }
        public string Difficulty { get; set; }
        public DateTime Date { get; set; }
    }
}
