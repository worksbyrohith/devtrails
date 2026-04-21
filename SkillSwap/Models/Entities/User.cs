
using SkillSwap.Models.Enums;

namespace SkillSwap.Models.Entities;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public string? ZipCode { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    // Navigation
    public ICollection<UserSkill> SkillsOffered { get; set; } = new List<UserSkill>();
    public ICollection<UserSkillWanted> SkillsWanted { get; set; } = new List<UserSkillWanted>();
    public ICollection<SwapRequest> SentRequests { get; set; } = new List<SwapRequest>();
    public ICollection<SwapRequest> ReceivedRequests { get; set; } = new List<SwapRequest>();
    public ICollection<Review> ReviewsGiven { get; set; } = new List<Review>();
    public ICollection<Review> ReviewsReceived { get; set; } = new List<Review>();
}