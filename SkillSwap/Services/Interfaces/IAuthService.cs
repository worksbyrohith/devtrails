using SkillSwap.Models.DTOs.Auth;
using SkillSwap.Models.DTOs.Auth;

namespace SkillSwap.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}