using SkillSwap.Models.DTOs.User;
using SkillSwap.Models.DTOs.User;

namespace SkillSwap.Services.Interfaces;

public interface IUserService
{
    Task<UserProfileDto> GetProfileAsync(int userId);
    Task<UserProfileDto> UpdateProfileAsync(int userId, UpdateProfileDto dto);
    Task<string> UploadAvatarAsync(int userId, IFormFile file);
    Task<List<UserProfileDto>> SearchUsersAsync(double lat, double lng, double radiusMiles, int? skillId);
    Task<List<UserProfileDto>> GetAllUsersAsync(int page, int pageSize);
}