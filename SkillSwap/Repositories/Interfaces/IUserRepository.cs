using SkillSwap.Models.Entities;
using SkillSwap.Models.Entities;

namespace SkillSwap.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEmailAsync(string email);
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task<List<User>> GetAllAsync();
    Task<List<User>> SearchByProximityAsync(double lat, double lng, double radiusMiles);
    Task<bool> ExistsAsync(int id);
}