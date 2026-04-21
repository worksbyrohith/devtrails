using SkillSwap.Models.DTOs;
using SkillSwap.Models.DTOs.Skill;
using SkillSwap.Models.DTOs;
using SkillSwap.Models.DTOs.Skill;

namespace SkillSwap.Services.Interfaces;

public interface ISkillService
{
    Task<List<SkillDto>> GetAllSkillsAsync();
    Task<List<SkillMetricsDto>> GetSkillMetricsAsync();
}