using SkillSwap.Models.DTOs.Review;
using SkillSwap.Models.DTOs.Review;

namespace SkillSwap.Services.Interfaces;

public interface IReviewService
{
    Task<ReviewDto> CreateReviewAsync(int reviewerId, CreateReviewDto dto);
    Task<List<ReviewDto>> GetUserReviewsAsync(int userId);
}