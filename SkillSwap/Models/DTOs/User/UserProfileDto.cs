namespace SkillSwap.Models.DTOs.User;

public class UserProfileDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public string? ZipCode { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public DateTime CreatedAt { get; set; }
    public double AverageRating { get; set; }
    public int TotalSwapsCompleted { get; set; }
    public List<SkillDto> SkillsOffered { get; set; } = new();
    public List<SkillDto> SkillsWanted { get; set; } = new();
}