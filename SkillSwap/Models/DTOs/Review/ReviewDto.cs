namespace SkillSwap.Models.DTOs.Review;

public class ReviewDto
{
    public int Id { get; set; }
    public int ReviewerId { get; set; }
    public string ReviewerName { get; set; } = string.Empty;
    public string? ReviewerAvatar { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string SwapSkillOffered { get; set; } = string.Empty;
    public string SwapSkillWanted { get; set; } = string.Empty;
}