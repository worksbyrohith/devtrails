namespace SkillSwap.Models.Entities;

public class UserSkillWanted
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int SkillId { get; set; }

    public User User { get; set; } = null!;
    public Skill Skill { get; set; } = null!;
}