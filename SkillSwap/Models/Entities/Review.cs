using SkillSwap.Models.Entities;

namespace SkillSwap.Models.Entities;

public class Review
{
    public int Id { get; set; }
    public int SwapRequestId { get; set; }
    public int ReviewerId { get; set; }
    public int RevieweeId { get; set; }
    public int Rating { get; set; }  // 1-5
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public SwapRequest SwapRequest { get; set; } = null!;
    public User Reviewer { get; set; } = null!;
    public User Reviewee { get; set; } = null!;
}