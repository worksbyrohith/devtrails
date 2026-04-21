using SkillSwap.Models.DTOs.Swap;
using SkillSwap.Models.Entities;
using SkillSwap.Models.Enums;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Services.Interfaces;

namespace SkillSwap.Services;

public class SwapService : ISwapService
{
    private readonly ISwapRepository _swapRepo;
    private readonly IUserRepository _userRepo;

    public SwapService(ISwapRepository swapRepo, IUserRepository userRepo)
    {
        _swapRepo = swapRepo;
        _userRepo = userRepo;
    }

    public async Task<SwapRequestDto> CreateSwapRequestAsync(int requesterId, CreateSwapRequestDto dto)
    {
        if (await _swapRepo.HasPendingReviewAsync(requesterId))
            throw new InvalidOperationException("You must review your completed swaps before initiating new ones.");

        if (dto.Message.Length < 250)
            throw new InvalidOperationException("Message must be at least 250 characters.");

        var swap = new SwapRequest
        {
            RequesterId = requesterId,
            ReceiverId = dto.ReceiverId,
            OfferedSkillId = dto.OfferedSkillId,
            WantedSkillId = dto.WantedSkillId,
            Message = dto.Message,
            Status = SwapStatus.Pending
        };

        var created = await _swapRepo.CreateAsync(swap);
        var full = await _swapRepo.GetByIdAsync(created.Id) ?? created;
        return ToDto(full);
    }

    public async Task<SwapRequestDto> AcceptSwapAsync(int swapId, int userId)
    {
        var swap = await _swapRepo.GetByIdAsync(swapId)
            ?? throw new KeyNotFoundException("Swap not found.");

        if (swap.ReceiverId != userId)
            throw new UnauthorizedAccessException("Only the receiver can accept this swap.");

        if (swap.Status != SwapStatus.Pending)
            throw new InvalidOperationException("Swap is not in a pending state.");

        swap.Status = SwapStatus.Active;

        var requester = await _userRepo.GetByIdAsync(swap.RequesterId);
        if (requester != null)
        {
            var offeredSkill = requester.SkillsOffered.FirstOrDefault(s => s.SkillId == swap.OfferedSkillId);
            if (offeredSkill != null) offeredSkill.IsAvailable = false;
            await _userRepo.UpdateAsync(requester);
        }

        var updated = await _swapRepo.UpdateAsync(swap);
        return ToDto(updated);
    }

    public async Task<SwapRequestDto> DeclineSwapAsync(int swapId, int userId)
    {
        var swap = await _swapRepo.GetByIdAsync(swapId)
            ?? throw new KeyNotFoundException("Swap not found.");

        if (swap.ReceiverId != userId)
            throw new UnauthorizedAccessException("Only the receiver can decline this swap.");

        swap.Status = SwapStatus.Declined;
        var updated = await _swapRepo.UpdateAsync(swap);
        return ToDto(updated);
    }

    public async Task<SwapRequestDto> CompleteSwapAsync(int swapId, int userId)
    {
        var swap = await _swapRepo.GetByIdAsync(swapId)
            ?? throw new KeyNotFoundException("Swap not found.");

        if (swap.RequesterId != userId && swap.ReceiverId != userId)
            throw new UnauthorizedAccessException("You are not part of this swap.");

        if (swap.Status != SwapStatus.Active)
            throw new InvalidOperationException("Swap must be Active to complete.");

        swap.Status = SwapStatus.Completed;

        var requester = await _userRepo.GetByIdAsync(swap.RequesterId);
        if (requester != null)
        {
            var skill = requester.SkillsOffered.FirstOrDefault(s => s.SkillId == swap.OfferedSkillId);
            if (skill != null) skill.IsAvailable = true;
            await _userRepo.UpdateAsync(requester);
        }

        var updated = await _swapRepo.UpdateAsync(swap);
        return ToDto(updated);
    }

    public async Task<SwapDashboardDto> GetDashboardAsync(int userId)
    {
        var all = await _swapRepo.GetByUserIdAsync(userId);

        return new SwapDashboardDto
        {
            PendingOutbound = all
                .Where(s => s.RequesterId == userId && s.Status == SwapStatus.Pending)
                .Select(s => ToDto(s)).ToList(),
            PendingInbound = all
                .Where(s => s.ReceiverId == userId && s.Status == SwapStatus.Pending)
                .Select(s => ToDto(s)).ToList(),
            ActiveSwaps = all
                .Where(s => s.Status == SwapStatus.Active)
                .Select(s => ToDto(s)).ToList(),
            CompletedSwaps = all
                .Where(s => s.Status == SwapStatus.Completed)
                .Select(s => ToDto(s)).ToList()
        };
    }

    public async Task<SwapRequestDto> GetByIdAsync(int swapId)
    {
        var swap = await _swapRepo.GetByIdAsync(swapId)
            ?? throw new KeyNotFoundException("Swap not found.");
        return ToDto(swap);
    }

    // Single, unambiguous mapping method — renamed to ToDto
    private static SwapRequestDto ToDto(SwapRequest s) => new()
    {
        Id = s.Id,
        RequesterId = s.RequesterId,
        RequesterName = s.Requester?.FullName ?? "",
        RequesterAvatar = s.Requester?.AvatarUrl,
        ReceiverId = s.ReceiverId,
        ReceiverName = s.Receiver?.FullName ?? "",
        OfferedSkillId = s.OfferedSkillId,
        OfferedSkillName = s.OfferedSkill?.Name ?? "",
        WantedSkillId = s.WantedSkillId,
        WantedSkillName = s.WantedSkill?.Name ?? "",
        Message = s.Message,
        Status = s.Status,
        CreatedAt = s.CreatedAt,
        UpdatedAt = s.UpdatedAt
    };
}