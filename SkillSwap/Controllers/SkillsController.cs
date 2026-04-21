using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillSwap.Services.Interfaces;
using SkillSwap.Services.Interfaces;

namespace SkillSwap.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SkillsController : ControllerBase
{
    private readonly ISkillService _skillService;
    public SkillsController(ISkillService skillService) => _skillService = skillService;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _skillService.GetAllSkillsAsync());

    [HttpGet("metrics")]
    public async Task<IActionResult> GetMetrics() => Ok(await _skillService.GetSkillMetricsAsync());
}