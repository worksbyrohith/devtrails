using Microsoft.EntityFrameworkCore;
using SkillSwap.Data;
using SkillSwap.Models.Entities;
using SkillSwap.Models.Enums;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Data;
using SkillSwap.Models.Entities;
using SkillSwap.Models.Enums;
using SkillSwap.Repositories.Interfaces;

namespace SkillSwap.Repositories;

public class SwapRepository : ISwapRepository
{
    private readonly AppDbContext _ctx;
    public SwapRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<SwapRequest?> GetByIdAsync(int id) =>
        await _ctx.SwapRequests
            .Include(s => s.Requester)
            .Include(s => s.Receiver)
            .Include(s => s.OfferedSkill)
            .Include(s => s.WantedSkill)
            .FirstOrDefaultAsync(s => s.Id == id);

    public async Task<SwapRequest> CreateAsync(SwapRequest request)
    {
        _ctx.SwapRequests.Add(request);
        await _ctx.SaveChangesAsync();
        return request;
    }

    public async Task<SwapRequest> UpdateAsync(SwapRequest request)
    {
        request.UpdatedAt = DateTime.UtcNow;
        _ctx.SwapRequests.Update(request);
        await _ctx.SaveChangesAsync();
        return request;
    }

    public async Task<List<SwapRequest>> GetByUserIdAsync(int userId) =>
        await _ctx.SwapRequests
            .Include(s => s.Requester)
            .Include(s => s.Receiver)
            .Include(s => s.OfferedSkill)
            .Include(s => s.WantedSkill)
            .Where(s => s.RequesterId == userId || s.ReceiverId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

    public async Task<List<SwapRequest>> GetCompletedByUserIdAsync(int userId) =>
        await _ctx.SwapRequests
            .Include(s => s.Requester)
            .Include(s => s.Receiver)
            .Include(s => s.OfferedSkill)
            .Include(s => s.WantedSkill)
            .Where(s => (s.RequesterId == userId || s.ReceiverId == userId)
                        && s.Status == SwapStatus.Completed)
            .OrderByDescending(s => s.UpdatedAt)
            .ToListAsync();

    // Blocks new swap if user has a completed swap with no review yet
    public async Task<bool> HasPendingReviewAsync(int userId)
    {
        var completedSwaps = await _ctx.SwapRequests
            .Where(s => (s.RequesterId == userId || s.ReceiverId == userId)
                        && s.Status == SwapStatus.Completed)
            .ToListAsync();

        foreach (var swap in completedSwaps)
        {
            var hasReview = await _ctx.Reviews
                .AnyAsync(r => r.SwapRequestId == swap.Id && r.ReviewerId == userId);
            if (!hasReview) return true;
        }
        return false;
    }
}