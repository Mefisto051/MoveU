using MoveU.Application.DTOs;
using MoveU.Application.Interfaces;
using MoveU.Application.Mappings;
using MoveU.Domain.Entities;
using MoveU.Domain.Interfaces;

namespace MoveU.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _uow;
        private readonly ITokenService _tokenService;

        public AuthService(IUnitOfWork uow, ITokenService tokenService)
        {
            _uow = uow;
            _tokenService = tokenService;
        }

        public async Task<AuthResponseDto> RegisterAsync(UserRegisterDto dto)
        {
            var exists = await _uow.Users.GetByEmailAsync(dto.Email);
            if (exists != null)
                throw new Exception("Email already registered");

            var user = dto.ToEntity();
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            await _uow.Users.AddAsync(user);
            await _uow.SaveAsync();

            var access = _tokenService.GenerateAccessToken(user);
            var refresh = _tokenService.GenerateRefreshToken();

            var refreshTokenEntity = new RefreshToken
            {
                Token = refresh,
                Expires = DateTime.UtcNow.AddDays(7),
                UserId = user.UserId
            };

            await _uow.RefreshTokens.AddAsync(refreshTokenEntity);
            await _uow.SaveAsync();

            return new AuthResponseDto
            {
                AccessToken = access,
                RefreshToken = refresh,
                User = user.ToDto()
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _uow.Users.GetByEmailAsync(dto.Email);
            if (user == null)
                throw new Exception("Invalid credentials");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Invalid credentials");

            var access = _tokenService.GenerateAccessToken(user);
            var refresh = _tokenService.GenerateRefreshToken();

            var refreshTokenEntity = new RefreshToken
            {
                Token = refresh,
                Expires = DateTime.UtcNow.AddDays(7),
                UserId = user.UserId
            };

            await _uow.RefreshTokens.AddAsync(refreshTokenEntity);
            await _uow.SaveAsync();

            return new AuthResponseDto
            {
                AccessToken = access,
                RefreshToken = refresh,
                User = user.ToDto()
            };
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(string accessToken, string refreshToken)
        {
            var user = await _uow.Users.GetByRefreshTokenAsync(refreshToken);

            if (user == null)
                throw new Exception("Invalid refresh token");

            var validToken = user.RefreshTokens
                .FirstOrDefault(t => t.Token == refreshToken && t.Expires > DateTime.UtcNow && !t.IsRevoked);

            if (validToken == null)
                throw new Exception("Expired or invalid refresh token");

            // Revoke old token
            validToken.IsRevoked = true;

            // Generate new tokens
            var newAccess = _tokenService.GenerateAccessToken(user);
            var newRefresh = _tokenService.GenerateRefreshToken();

            var newRefreshTokenEntity = new RefreshToken
            {
                Token = newRefresh,
                Expires = DateTime.UtcNow.AddDays(7),
                UserId = user.UserId
            };

            await _uow.RefreshTokens.AddAsync(newRefreshTokenEntity);
            await _uow.SaveAsync();

            return new AuthResponseDto
            {
                AccessToken = newAccess,
                RefreshToken = newRefresh,
                User = user.ToDto()
            };
        }
    }
}
