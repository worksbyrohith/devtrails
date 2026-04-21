using Microsoft.EntityFrameworkCore;
using SkillSwap.Data;
using SkillSwap.Models.Entities;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Data;
using SkillSwap.Models.Entities;
using SkillSwap.Repositories.Interfaces;

namespace SkillSwap.Repositories;

public class SkillRepository : ISkillRepository
{
    private readonly AppDbContext _ctx;
    public SkillRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<List<Skill>> GetAllAsync() =>
        await _ctx.Skills.OrderBy(s => s.Name).ToListAsync();

    public async Task<Skill?> GetByIdAsync(int id) =>
        await _ctx.Skills.FindAsync(id);

    public async Task<List<SkillMetricsData>> GetSkillMetricsAsync()
    {
        var skills = await _ctx.Skills.ToListAsync();
        var result = new List<SkillMetricsData>();

        foreach (var skill in skills)
        {
            var demand = await _ctx.UserSkillsWanted.CountAsync(s => s.SkillId == skill.Id);
            var supply = await _ctx.UserSkills.CountAsync(s => s.SkillId == skill.Id && s.IsAvailable);
            result.Add(new SkillMetricsData
            {
                SkillId = skill.Id,
                SkillName = skill.Name,
                Category = skill.Category,
                DemandCount = demand,
                SupplyCount = supply
            });
        }
        return result.OrderByDescending(r => r.DemandCount).ToList();
    }
}