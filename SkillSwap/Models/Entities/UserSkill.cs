namespace SkillSwap.Models.Entities;

public class UserSkill
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int SkillId { get; set; }
    public string? ExperienceLevel { get; set; } // Beginner, Intermediate, Expert
    public bool IsAvailable { get; set; } = true;

    public User User { get; set; } = null!;
    public Skill Skill { get; set; } = null!;
}