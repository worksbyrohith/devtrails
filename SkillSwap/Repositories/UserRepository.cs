using Microsoft.EntityFrameworkCore;
using SkillSwap.Data;
using SkillSwap.Models.Entities;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Data;
using SkillSwap.Models.Entities;
using SkillSwap.Repositories.Interfaces;

namespace SkillSwap.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _ctx;
    public UserRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<User?> GetByIdAsync(int id) =>
        await _ctx.Users
            .Include(u => u.SkillsOffered).ThenInclude(s => s.Skill)
            .Include(u => u.SkillsWanted).ThenInclude(s => s.Skill)
            .FirstOrDefaultAsync(u => u.Id == id);

    public async Task<User?> GetByEmailAsync(string email) =>
        await _ctx.Users.FirstOrDefaultAsync(u => u.Email == email.ToLower());

    public async Task<User> CreateAsync(User user)
    {
        user.Email = user.Email.ToLower();
        _ctx.Users.Add(user);
        await _ctx.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(User user)
    {
        _ctx.Users.Update(user);
        await _ctx.SaveChangesAsync();
        return user;
    }

    public async Task<List<User>> GetAllAsync() =>
        await _ctx.Users
            .Include(u => u.SkillsOffered).ThenInclude(s => s.Skill)
            .Include(u => u.SkillsWanted).ThenInclude(s => s.Skill)
            .Where(u => u.IsActive)
            .ToListAsync();

    // Haversine formula in-memory filter (SQL Server doesn't have native geo without extensions)
    public async Task<List<User>> SearchByProximityAsync(double lat, double lng, double radiusMiles)
    {
        var users = await GetAllAsync();
        return users.Where(u =>
            u.Latitude.HasValue && u.Longitude.HasValue &&
            HaversineDistance(lat, lng, u.Latitude.Value, u.Longitude.Value) <= radiusMiles
        ).ToList();
    }

    public async Task<bool> ExistsAsync(int id) =>
        await _ctx.Users.AnyAsync(u => u.Id == id);

    private static double HaversineDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 3958.8; // Earth radius in miles
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    }
}