using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillSwap.Models.DTOs.Swap;
using SkillSwap.Services.Interfaces;
using SkillSwap.Models.DTOs.Swap;
using SkillSwap.Services.Interfaces;
using System.Security.Claims;

namespace SkillSwap.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SwapsController : ControllerBase
{
    private readonly ISwapService _swapService;
    public SwapsController(ISwapService swapService) => _swapService = swapService;

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
        => Ok(await _swapService.GetDashboardAsync(GetUserId()));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try { return Ok(await _swapService.GetByIdAsync(id)); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSwapRequestDto dto)
    {
        try { return Ok(await _swapService.CreateSwapRequestAsync(GetUserId(), dto)); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("{id}/accept")]
    public async Task<IActionResult> Accept(int id)
    {
        try { return Ok(await _swapService.AcceptSwapAsync(id, GetUserId())); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("{id}/decline")]
    public async Task<IActionResult> Decline(int id)
    {
        try { return Ok(await _swapService.DeclineSwapAsync(id, GetUserId())); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("{id}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        try { return Ok(await _swapService.CompleteSwapAsync(id, GetUserId())); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
}