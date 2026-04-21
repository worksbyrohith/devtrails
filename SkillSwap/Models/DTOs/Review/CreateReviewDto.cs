using System.ComponentModel.DataAnnotations;

namespace SkillSwap.Models.DTOs.Review;

public class CreateReviewDto
{
    [Required]
    public int SwapRequestId { get; set; }

    [Required]
    public int RevieweeId { get; set; }

    [Required, Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    public string Comment { get; set; } = string.Empty;
}