using Microsoft.EntityFrameworkCore;
using MoveU.Domain.Entities;

namespace MoveU.Infrastructure.Data
{
    public class MoveUDbContext : DbContext
    {
        public MoveUDbContext(DbContextOptions<MoveUDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<ActivityPlan> ActivityPlans { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(b =>
            {
                b.HasKey(x => x.UserId);
                b.Property(x => x.FullName).IsRequired().HasMaxLength(150);
                b.Property(x => x.Email).IsRequired().HasMaxLength(150);
                b.HasMany(x => x.Plans).WithOne(p => p.User).HasForeignKey(p => p.UserId);
                b.HasMany(x => x.RefreshTokens).WithOne(r => r.User).HasForeignKey(r => r.UserId);
            });

            modelBuilder.Entity<ActivityPlan>(b =>
            {
                b.HasKey(x => x.ActivityPlanId);
                b.Property(x => x.Title).IsRequired().HasMaxLength(100);
            });

            modelBuilder.Entity<RefreshToken>(b =>
            {
                b.HasKey(x => x.RefreshTokenId);
                b.Property(x => x.Token).IsRequired();
            });
        }
    }
}
