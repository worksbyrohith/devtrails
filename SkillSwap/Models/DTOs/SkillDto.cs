namespace SkillSwap.Models.DTOs;

public class SkillDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? ExperienceLevel { get; set; }
}