using SkillSwap.Models.DTOs.Swap;

namespace SkillSwap.Models.DTOs.Swap;

public class SwapDashboardDto
{
    public List<SwapRequestDto> PendingOutbound { get; set; } = new();
    public List<SwapRequestDto> PendingInbound { get; set; } = new();
    public List<SwapRequestDto> ActiveSwaps { get; set; } = new();
    public List<SwapRequestDto> CompletedSwaps { get; set; } = new();
}