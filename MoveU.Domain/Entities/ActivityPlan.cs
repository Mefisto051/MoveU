namespace MoveU.Domain.Entities
{
    public class ActivityPlan
    {
        public int ActivityPlanId { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public string Title { get; set; }
        public string? Description { get; set; }

        public int DurationMinutes { get; set; }
        public string Difficulty { get; set; }

        public DateTime Date { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
