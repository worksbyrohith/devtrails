using SkillSwap.Models.Entities;
using SkillSwap.Models.Entities;

namespace SkillSwap.Repositories.Interfaces;

public interface IReviewRepository
{
    Task<Review> CreateAsync(Review review);
    Task<List<Review>> GetByRevieweeIdAsync(int revieweeId);
    Task<bool> ReviewExistsAsync(int swapRequestId, int reviewerId);
    Task<double> GetAverageRatingAsync(int userId);
}