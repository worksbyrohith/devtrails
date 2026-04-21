using SkillSwap.Models.DTOs.Review;
using SkillSwap.Models.Entities;
using SkillSwap.Models.Enums;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Services.Interfaces;
using SkillSwap.Models.DTOs.Review;
using SkillSwap.Models.Entities;
using SkillSwap.Models.Enums;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Services.Interfaces;

namespace SkillSwap.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepo;
    private readonly ISwapRepository _swapRepo;

    public ReviewService(IReviewRepository reviewRepo, ISwapRepository swapRepo)
    {
        _reviewRepo = reviewRepo;
        _swapRepo = swapRepo;
    }

    public async Task<ReviewDto> CreateReviewAsync(int reviewerId, CreateReviewDto dto)
    {
        var swap = await _swapRepo.GetByIdAsync(dto.SwapRequestId)
            ?? throw new KeyNotFoundException("Swap not found.");

        if (swap.Status != SwapStatus.Completed)
            throw new InvalidOperationException("Can only review completed swaps.");

        if (swap.RequesterId != reviewerId && swap.ReceiverId != reviewerId)
            throw new UnauthorizedAccessException("You are not part of this swap.");

        if (await _reviewRepo.ReviewExistsAsync(dto.SwapRequestId, reviewerId))
            throw new InvalidOperationException("You have already reviewed this swap.");

        var review = new Review
        {
            SwapRequestId = dto.SwapRequestId,
            ReviewerId = reviewerId,
            RevieweeId = dto.RevieweeId,
            Rating = dto.Rating,
            Comment = dto.Comment
        };

        var created = await _reviewRepo.CreateAsync(review);

        return new ReviewDto
        {
            Id = created.Id,
            ReviewerId = created.ReviewerId,
            Rating = created.Rating,
            Comment = created.Comment,
            CreatedAt = created.CreatedAt
        };
    }

    public async Task<List<ReviewDto>> GetUserReviewsAsync(int userId)
    {
        var reviews = await _reviewRepo.GetByRevieweeIdAsync(userId);
        return reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ReviewerId = r.ReviewerId,
            ReviewerName = r.Reviewer?.FullName ?? "",
            ReviewerAvatar = r.Reviewer?.AvatarUrl,
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt,
            SwapSkillOffered = r.SwapRequest?.OfferedSkill?.Name ?? "",
            SwapSkillWanted = r.SwapRequest?.WantedSkill?.Name ?? ""
        }).ToList();
    }
}