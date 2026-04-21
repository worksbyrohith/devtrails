using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillSwap.Models.DTOs.Review;
using SkillSwap.Services.Interfaces;
using SkillSwap.Models.DTOs.Review;
using SkillSwap.Services.Interfaces;
using System.Security.Claims;

namespace SkillSwap.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;
    public ReviewsController(IReviewService reviewService) => _reviewService = reviewService;

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
    {
        try { return Ok(await _reviewService.CreateReviewAsync(GetUserId(), dto)); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
}