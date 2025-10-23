using Messenger.Domain.Entities;

namespace Messenger.Application.Interfaces;

public interface IRefreshTokenRepository
{
    public Task<RefreshToken> CreateToken(string phoneNumber);
    
    public Task<RefreshToken> RefRefreshToken(string token);
}