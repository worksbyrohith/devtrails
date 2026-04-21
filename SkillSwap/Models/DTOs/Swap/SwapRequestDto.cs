using SkillSwap.Models.Enums;
using SkillSwap.Models.Enums;

namespace SkillSwap.Models.DTOs.Swap;

public class SwapRequestDto
{
    public int Id { get; set; }
    public int RequesterId { get; set; }
    public string RequesterName { get; set; } = string.Empty;
    public string? RequesterAvatar { get; set; }
    public double RequesterRating { get; set; }

    public int ReceiverId { get; set; }
    public string ReceiverName { get; set; } = string.Empty;

    public int OfferedSkillId { get; set; }
    public string OfferedSkillName { get; set; } = string.Empty;

    public int WantedSkillId { get; set; }
    public string WantedSkillName { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
    public SwapStatus Status { get; set; }
    public string StatusLabel => Status.ToString();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}