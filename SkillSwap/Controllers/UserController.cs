using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillSwap.Models.DTOs.User;
using SkillSwap.Services.Interfaces;
using SkillSwap.Models.DTOs.User;
using SkillSwap.Services.Interfaces;
using System.Security.Claims;

namespace SkillSwap.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    public UsersController(IUserService userService) => _userService = userService;

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        try { return Ok(await _userService.GetProfileAsync(GetUserId())); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfile(int id)
    {
        try { return Ok(await _userService.GetProfileAsync(id)); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        try { return Ok(await _userService.UpdateProfileAsync(GetUserId(), dto)); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPost("me/avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        try
        {
            var url = await _userService.UploadAvatarAsync(GetUserId(), file);
            return Ok(new { avatarUrl = url });
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        => Ok(await _userService.GetAllUsersAsync(page, pageSize));

    [HttpGet("search")]
    public async Task<IActionResult> SearchUsers(
        [FromQuery] double lat, [FromQuery] double lng,
        [FromQuery] double radius = 25, [FromQuery] int? skillId = null)
        => Ok(await _userService.SearchUsersAsync(lat, lng, radius, skillId));

    [HttpGet("{id}/reviews")]
    public async Task<IActionResult> GetUserReviews(int id, [FromServices] IReviewService reviewService)
        => Ok(await reviewService.GetUserReviewsAsync(id));
}