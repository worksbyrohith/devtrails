using System.ComponentModel.DataAnnotations;

namespace SkillSwap.Models.DTOs.Swap;

public class CreateSwapRequestDto
{
    [Required]
    public int ReceiverId { get; set; }

    [Required]
    public int OfferedSkillId { get; set; }

    [Required]
    public int WantedSkillId { get; set; }

    [Required, MinLength(250, ErrorMessage = "Message must be at least 250 characters.")]
    public string Message { get; set; } = string.Empty;
}