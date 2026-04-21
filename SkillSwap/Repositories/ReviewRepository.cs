using Microsoft.EntityFrameworkCore;
using SkillSwap.Data;
using SkillSwap.Models.Entities;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Data;
using SkillSwap.Models.Entities;
using SkillSwap.Repositories.Interfaces;

namespace SkillSwap.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _ctx;
    public ReviewRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Review> CreateAsync(Review review)
    {
        _ctx.Reviews.Add(review);
        await _ctx.SaveChangesAsync();
        return review;
    }

    public async Task<List<Review>> GetByRevieweeIdAsync(int revieweeId) =>
        await _ctx.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.SwapRequest).ThenInclude(s => s.OfferedSkill)
            .Include(r => r.SwapRequest).ThenInclude(s => s.WantedSkill)
            .Where(r => r.RevieweeId == revieweeId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

    public async Task<bool> ReviewExistsAsync(int swapRequestId, int reviewerId) =>
        await _ctx.Reviews.AnyAsync(r =>
            r.SwapRequestId == swapRequestId && r.ReviewerId == reviewerId);

    public async Task<double> GetAverageRatingAsync(int userId)
    {
        var ratings = await _ctx.Reviews
            .Where(r => r.RevieweeId == userId)
            .Select(r => r.Rating)
            .ToListAsync();
        return ratings.Count == 0 ? 0 : ratings.Average();
    }
}