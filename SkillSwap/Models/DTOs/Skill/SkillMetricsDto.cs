namespace SkillSwap.Models.DTOs.Skill;

public class SkillMetricsDto
{
    public int SkillId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int DemandCount { get; set; }   // How many want it
    public int SupplyCount { get; set; }   // How many offer it
    public double DemandToSupplyRatio { get; set; }
}