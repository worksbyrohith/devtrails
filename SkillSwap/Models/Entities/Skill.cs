using SkillSwap.Models.Entities;

namespace SkillSwap.Models.Entities;

public class Skill
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Description { get; set; }

    public ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
    public ICollection<UserSkillWanted> UserSkillsWanted { get; set; } = new List<UserSkillWanted>();
}