using SkillSwap.Helpers;
using SkillSwap.Models.DTOs.Auth;
using SkillSwap.Models.Entities;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Services.Interfaces;
using SkillSwap.Helpers;
using SkillSwap.Models.DTOs.Auth;
using SkillSwap.Models.Entities;
using SkillSwap.Repositories.Interfaces;
using SkillSwap.Services.Interfaces;

namespace SkillSwap.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly ISkillRepository _skillRepo;
    private readonly JwtHelper _jwt;

    public AuthService(IUserRepository userRepo, ISkillRepository skillRepo, IConfiguration config)
    {
        _userRepo = userRepo;
        _skillRepo = skillRepo;
        _jwt = new JwtHelper(config);
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // Enforce at least 1 skill offered + 1 wanted
        if (dto.SkillsOfferedIds.Count == 0)
            throw new InvalidOperationException("You must offer at least one skill.");
        if (dto.SkillsWantedIds.Count == 0)
            throw new InvalidOperationException("You must want at least one skill.");

        var existing = await _userRepo.GetByEmailAsync(dto.Email);
        if (existing != null)
            throw new InvalidOperationException("Email already registered.");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Bio = dto.Bio,
            ZipCode = dto.ZipCode,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            SkillsOffered = dto.SkillsOfferedIds.Select(id => new UserSkill { SkillId = id }).ToList(),
            SkillsWanted = dto.SkillsWantedIds.Select(id => new UserSkillWanted { SkillId = id }).ToList()
        };

        var created = await _userRepo.CreateAsync(user);
        var (token, expiresAt) = _jwt.GenerateToken(created);

        return new AuthResponseDto
        {
            Token = token,
            UserId = created.Id,
            FullName = created.FullName,
            Email = created.Email,
            ExpiresAt = expiresAt
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email)
            ?? throw new InvalidOperationException("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new InvalidOperationException("Invalid email or password.");

        var (token, expiresAt) = _jwt.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            ExpiresAt = expiresAt
        };
    }
}