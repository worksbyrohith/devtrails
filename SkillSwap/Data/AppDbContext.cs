using Microsoft.EntityFrameworkCore;
using SkillSwap.Models.Entities;

namespace SkillSwap.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<UserSkill> UserSkills => Set<UserSkill>();
    public DbSet<UserSkillWanted> UserSkillsWanted => Set<UserSkillWanted>();
    public DbSet<SwapRequest> SwapRequests => Set<SwapRequest>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ─── User ─────────────────────────────────────────────────────────────
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // ─── SwapRequest → Requester ──────────────────────────────────────────
        modelBuilder.Entity<SwapRequest>()
            .HasOne(s => s.Requester)
            .WithMany(u => u.SentRequests)
            .HasForeignKey(s => s.RequesterId)
            .OnDelete(DeleteBehavior.Restrict);

        // ─── SwapRequest → Receiver ───────────────────────────────────────────
        modelBuilder.Entity<SwapRequest>()
            .HasOne(s => s.Receiver)
            .WithMany(u => u.ReceivedRequests)
            .HasForeignKey(s => s.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        // ─── SwapRequest → OfferedSkill ───────────────────────────────────────
        modelBuilder.Entity<SwapRequest>()
            .HasOne(s => s.OfferedSkill)
            .WithMany()
            .HasForeignKey(s => s.OfferedSkillId)
            .OnDelete(DeleteBehavior.Restrict);

        // ─── SwapRequest → WantedSkill ────────────────────────────────────────
        modelBuilder.Entity<SwapRequest>()
            .HasOne(s => s.WantedSkill)
            .WithMany()
            .HasForeignKey(s => s.WantedSkillId)
            .OnDelete(DeleteBehavior.Restrict);

        // ─── Review → SwapRequest (explicitly configured) ─────────────────────
        modelBuilder.Entity<Review>()
            .HasOne(r => r.SwapRequest)
            .WithMany()                        // ← no nav property on SwapRequest side
            .HasForeignKey(r => r.SwapRequestId)
            .OnDelete(DeleteBehavior.Restrict);

        // ─── Review → Reviewer ────────────────────────────────────────────────
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Reviewer)
            .WithMany(u => u.ReviewsGiven)
            .HasForeignKey(r => r.ReviewerId)
            .OnDelete(DeleteBehavior.Restrict);

        // ─── Review → Reviewee ────────────────────────────────────────────────
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Reviewee)
            .WithMany(u => u.ReviewsReceived)
            .HasForeignKey(r => r.RevieweeId)
            .OnDelete(DeleteBehavior.Restrict);

        // ─── Seed Skills ──────────────────────────────────────────────────────
        modelBuilder.Entity<Skill>().HasData(
            new Skill { Id = 1, Name = "Web Development", Category = "Technology" },
            new Skill { Id = 2, Name = "Graphic Design", Category = "Creative" },
            new Skill { Id = 3, Name = "Guitar Lessons", Category = "Music" },
            new Skill { Id = 4, Name = "Language Tutoring", Category = "Education" },
            new Skill { Id = 5, Name = "Plumbing", Category = "Trades" },
            new Skill { Id = 6, Name = "Photography", Category = "Creative" },
            new Skill { Id = 7, Name = "Cooking Classes", Category = "Lifestyle" },
            new Skill { Id = 8, Name = "Yoga Instruction", Category = "Health" },
            new Skill { Id = 9, Name = "Accounting", Category = "Finance" },
            new Skill { Id = 10, Name = "Carpentry", Category = "Trades" }
        );
    }
}