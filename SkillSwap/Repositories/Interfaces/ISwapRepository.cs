using SkillSwap.Models.Entities;
using SkillSwap.Models.Enums;
using SkillSwap.Models.Entities;

namespace SkillSwap.Repositories.Interfaces;

public interface ISwapRepository
{
    Task<SwapRequest?> GetByIdAsync(int id);
    Task<SwapRequest> CreateAsync(SwapRequest request);
    Task<SwapRequest> UpdateAsync(SwapRequest request);
    Task<List<SwapRequest>> GetByUserIdAsync(int userId);
    Task<List<SwapRequest>> GetCompletedByUserIdAsync(int userId);
    Task<bool> HasPendingReviewAsync(int userId);
}