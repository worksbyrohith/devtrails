using SkillSwap.Models.Entities;
using SkillSwap.Models.Entities;

namespace SkillSwap.Repositories.Interfaces;

public interface ISkillRepository
{
    Task<List<Skill>> GetAllAsync();
    Task<Skill?> GetByIdAsync(int id);
    Task<List<SkillMetricsData>> GetSkillMetricsAsync();
}

public class SkillMetricsData
{
    public int SkillId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string? Category { get; set; }
    public int DemandCount { get; set; }
    public int SupplyCount { get; set; }
}