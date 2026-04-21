using SkillSwap.Models.DTOs;
using SkillSwap.Models.DTOs.User;
using SkillSwap.Models.Entities;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Services.Interfaces;
using SkillSwap.Models.DTOs;
using SkillSwap.Models.DTOs.User;
using SkillSwap.Models.Entities;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Services.Interfaces;

namespace SkillSwap.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepo;
    private readonly IReviewRepository _reviewRepo;
    private readonly ISwapRepository _swapRepo;
    private readonly IWebHostEnvironment _env;

    public UserService(IUserRepository userRepo, IReviewRepository reviewRepo,
        ISwapRepository swapRepo, IWebHostEnvironment env)
    {
        _userRepo = userRepo;
        _reviewRepo = reviewRepo;
        _swapRepo = swapRepo;
        _env = env;
    }

    public async Task<UserProfileDto> GetProfileAsync(int userId)
    {
        var user = await _userRepo.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");
        return await MapToDto(user);
    }

    public async Task<UserProfileDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var user = await _userRepo.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        if (dto.FullName != null) user.FullName = dto.FullName;
        if (dto.Bio != null) user.Bio = dto.Bio;
        if (dto.ZipCode != null) user.ZipCode = dto.ZipCode;
        if (dto.Latitude.HasValue) user.Latitude = dto.Latitude;
        if (dto.Longitude.HasValue) user.Longitude = dto.Longitude;

        if (dto.SkillsOfferedIds != null)
        {
            user.SkillsOffered = dto.SkillsOfferedIds
                .Select(id => new UserSkill { UserId = userId, SkillId = id }).ToList();
        }
        if (dto.SkillsWantedIds != null)
        {
            user.SkillsWanted = dto.SkillsWantedIds
                .Select(id => new UserSkillWanted { UserId = userId, SkillId = id }).ToList();
        }

        var updated = await _userRepo.UpdateAsync(user);
        return await MapToDto(updated);
    }

    public async Task<string> UploadAvatarAsync(int userId, IFormFile file)
    {
        var user = await _userRepo.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        var uploadsPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "avatars");
        Directory.CreateDirectory(uploadsPath);

        var ext = Path.GetExtension(file.FileName).ToLower();
        if (ext != ".jpg" && ext != ".jpeg" && ext != ".png")
            throw new InvalidOperationException("Only JPEG and PNG files are allowed.");

        var fileName = $"{userId}_{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsPath, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        user.AvatarUrl = $"/avatars/{fileName}";
        await _userRepo.UpdateAsync(user);
        return user.AvatarUrl;
    }

    public async Task<List<UserProfileDto>> SearchUsersAsync(double lat, double lng,
        double radiusMiles, int? skillId)
    {
        var users = await _userRepo.SearchByProximityAsync(lat, lng, radiusMiles);

        if (skillId.HasValue)
            users = users.Where(u => u.SkillsOffered.Any(s => s.SkillId == skillId.Value)).ToList();

        var dtos = new List<UserProfileDto>();
        foreach (var u in users)
            dtos.Add(await MapToDto(u));
        return dtos;
    }

    public async Task<List<UserProfileDto>> GetAllUsersAsync(int page, int pageSize)
    {
        var users = await _userRepo.GetAllAsync();
        var paged = users.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        var dtos = new List<UserProfileDto>();
        foreach (var u in paged)
            dtos.Add(await MapToDto(u));
        return dtos;
    }

    private async Task<UserProfileDto> MapToDto(User user)
    {
        var avgRating = await _reviewRepo.GetAverageRatingAsync(user.Id);
        var completed = await _swapRepo.GetCompletedByUserIdAsync(user.Id);

        return new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Bio = user.Bio,
            AvatarUrl = user.AvatarUrl,
            ZipCode = user.ZipCode,
            Latitude = user.Latitude,
            Longitude = user.Longitude,
            CreatedAt = user.CreatedAt,
            AverageRating = Math.Round(avgRating, 1),
            TotalSwapsCompleted = completed.Count,
            SkillsOffered = user.SkillsOffered.Select(s => new SkillDto
            {
                Id = s.SkillId,
                Name = s.Skill?.Name ?? "",
                Category = s.Skill?.Category,
                ExperienceLevel = s.ExperienceLevel
            }).ToList(),
            SkillsWanted = user.SkillsWanted.Select(s => new SkillDto
            {
                Id = s.SkillId,
                Name = s.Skill?.Name ?? "",
                Category = s.Skill?.Category
            }).ToList()
        };
    }
}