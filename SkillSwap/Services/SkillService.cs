using SkillSwap.Models.DTOs;
using SkillSwap.Models.DTOs.Skill;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Services.Interfaces;
using SkillSwap.Models.DTOs;
using SkillSwap.Models.DTOs.Skill;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Services.Interfaces;

namespace SkillSwap.Services;

public class SkillService : ISkillService
{
    private readonly ISkillRepository _skillRepo;
    public SkillService(ISkillRepository skillRepo) => _skillRepo = skillRepo;

    public async Task<List<SkillDto>> GetAllSkillsAsync()
    {
        var skills = await _skillRepo.GetAllAsync();
        return skills.Select(s => new SkillDto
        {
            Id = s.Id,
            Name = s.Name,
            Category = s.Category
        }).ToList();
    }

    public async Task<List<SkillMetricsDto>> GetSkillMetricsAsync()
    {
        var metrics = await _skillRepo.GetSkillMetricsAsync();
        return metrics.Select(m => new SkillMetricsDto
        {
            SkillId = m.SkillId,
            SkillName = m.SkillName,
            Category = m.Category,
            DemandCount = m.DemandCount,
            SupplyCount = m.SupplyCount,
            DemandToSupplyRatio = m.SupplyCount == 0 ? m.DemandCount : Math.Round((double)m.DemandCount / m.SupplyCount, 2)
        }).ToList();
    }
}