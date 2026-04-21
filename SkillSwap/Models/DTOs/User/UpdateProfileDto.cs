namespace SkillSwap.Models.DTOs.User;

public class UpdateProfileDto
{
    public string? FullName { get; set; }
    public string? Bio { get; set; }
    public string? ZipCode { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public List<int>? SkillsOfferedIds { get; set; }
    public List<int>? SkillsWantedIds { get; set; }
}