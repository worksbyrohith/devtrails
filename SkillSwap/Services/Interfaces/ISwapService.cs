using SkillSwap.Models.DTOs.Swap;
using SkillSwap.Models.DTOs.Swap;

namespace SkillSwap.Services.Interfaces;

public interface ISwapService
{
    Task<SwapRequestDto> CreateSwapRequestAsync(int requesterId, CreateSwapRequestDto dto);
    Task<SwapRequestDto> AcceptSwapAsync(int swapId, int userId);
    Task<SwapRequestDto> DeclineSwapAsync(int swapId, int userId);
    Task<SwapRequestDto> CompleteSwapAsync(int swapId, int userId);
    Task<SwapDashboardDto> GetDashboardAsync(int userId);
    Task<SwapRequestDto> GetByIdAsync(int swapId);
}