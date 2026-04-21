using System.ComponentModel.DataAnnotations;

namespace SkillSwap.Models.DTOs.Auth;

public class RegisterDto
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    public string? Bio { get; set; }
    public string? ZipCode { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    // Must have at least 1 each — enforced in service
    [Required]
    public List<int> SkillsOfferedIds { get; set; } = new();

    [Required]
    public List<int> SkillsWantedIds { get; set; } = new();
}