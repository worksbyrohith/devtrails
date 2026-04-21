using SkillSwap.Models.Enums;

namespace SkillSwap.Models.Entities;

public class SwapRequest
{
    public int Id { get; set; }
    public int RequesterId { get; set; }
    public int ReceiverId { get; set; }
    public int OfferedSkillId { get; set; }
    public int WantedSkillId { get; set; }
    public string Message { get; set; } = string.Empty;
    public SwapStatus Status { get; set; } = SwapStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public User Requester { get; set; } = null!;
    public User Receiver { get; set; } = null!;
    public Skill OfferedSkill { get; set; } = null!;
    public Skill WantedSkill { get; set; } = null!;

    // ← RequesterReview and ReceiverReview removed
    //    Reviews are accessed via Review.SwapRequestId instead
}